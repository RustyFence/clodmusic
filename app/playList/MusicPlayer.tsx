import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { apiUrl } from '../../config';

function MusicPlayer() {
    const { id } = useLocalSearchParams(); // 获取传递的音乐ID
    const [error, setError] = useState(null);
    const [songUrl, setSongUrl] = useState(null);
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songArtwork, setSongArtwork] = useState('');
    const [lyrics, setLyrics] = useState([]);
    const { position, duration } = useProgress(); // 获取播放进度和总时长
    const router = useRouter();
    const scrollViewRef = useRef(null); // 用于引用 ScrollView

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                // 获取音乐信息
                const songResponse = await axios.get(`${apiUrl}/song/detail`, {
                    params: { ids: id }
                });
                console.log("音乐信息",songResponse.data.songs[0]);
                const songData = songResponse.data.songs[0];
                setSongTitle(songData.name);
                setSongArtist(songData.ar.map(artist => artist.name).join(', '));
                setSongArtwork(songData.al.picUrl);

                // 获取音乐 URL
                const urlResponse = await axios.get(`${apiUrl}/song/url/v1`, {
                    params: { id, level: 'standard' }
                });

                const url = urlResponse.data.data[0]?.url;
                if (!url) {
                    throw new Error('无法获取音乐 URL');
                }
                setSongUrl(url);

                // 获取歌词
                const lyricResponse = await axios.get(`${apiUrl}/lyric/new`, {
                    params: { id }
                });
                console.log("歌词信息",lyricResponse.data);

                const parsedLyrics = parseLyrics(lyricResponse.data.lrc?.lyric || '', lyricResponse.data.tlyric?.lyric || '');
                setLyrics(parsedLyrics);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching song data:', err);
            }
        };

        fetchSongData();
    }, [id]);

    const handlePlay = async () => {
        try {
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: id,
                url: songUrl,
                title: songTitle,
                artist: songArtist,
                artwork: songArtwork,
            });

            await TrackPlayer.play();
        } catch (err) {
            setError(err.message);
            console.error('Error playing song:', err);
        }
    };

    const handlePause = async () => {
        await TrackPlayer.pause();
    };

    const handleSeek = async (value) => {
        await TrackPlayer.seekTo(value);
    };

    const parseLyrics = (lyrics, translations) => {
        const parseLine = (line: string) => {
            const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = parseInt(match[3], 10) * 10;
                const text = match[4].trim(); // 去除多余的空格
                const timestamp = minutes * 60 + seconds + milliseconds / 1000;
                return { timestamp, text };
            }
            return { timestamp: null, text: line.trim() };
        };

        const lyricsArray = lyrics.split('\n').map(parseLine);
        const translationsArray = translations.split('\n').map(parseLine);

        // 创建一个映射来快速查找翻译
        const translationMap = new Map();
        translationsArray.forEach(translation => {
            if (translation.timestamp !== null) {
                translationMap.set(translation.timestamp, translation.text);
            }
        });

        return lyricsArray.map(lyric => ({
            ...lyric,
            translation: lyric.timestamp !== null ? translationMap.get(lyric.timestamp) || '' : ''
        }));
    };

    const getCurrentLyricIndex = () => {
        return lyrics.findIndex(line => line.timestamp > position) - 1;
    };

    const currentLyricIndex = getCurrentLyricIndex();

    useEffect(() => {
        if (scrollViewRef.current && currentLyricIndex >= 0) {
            const LYRIC_LINE_HEIGHT = 60; // 每行歌词的固定高度（包含翻译）
            scrollViewRef.current.scrollTo({
                y: currentLyricIndex * LYRIC_LINE_HEIGHT-150,
                animated: true,
            });
        }
    }, [currentLyricIndex]);

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../images/bg1.jpg')} style={styles.backgroundImage}>
                <View style={styles.content}>
                    <Text style={styles.title}>音乐播放</Text>
                    
                    <View style={styles.songInfoContainer}>
                        {songArtwork && <Image source={{ uri: songArtwork }} style={styles.artwork} />}
                        <Text style={styles.songTitle}>{songTitle}</Text>
                        <Text style={styles.songArtist}>{songArtist}</Text>
                    </View>

                    <ScrollView ref={scrollViewRef} style={styles.lyricsContainer}>
                        {lyrics.map((line, index) => (
                            <View key={index} style={styles.lyricLine}>
                                <Text style={[
                                    styles.lyricsText,
                                    index === currentLyricIndex && styles.currentLyricText,
                                ]}>
                                    {line.text || '...'}
                                </Text>
                                
                                    <Text style={styles.translationText}>
                                        {line.translation}
                                    </Text>
                                
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.bottomContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onSlidingComplete={handleSeek}
                            minimumTrackTintColor="#ffffff"
                            maximumTrackTintColor="rgba(255,255,255,0.3)"
                            thumbTintColor="#ffffff"
                        />
                        {songUrl && (
                            <View style={styles.controls}>
                                <TouchableOpacity onPress={handlePlay}>
                                    <Image source={require('../images/play.png')} style={styles.buttonImage} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handlePause}>
                                    <Image source={require('../images/pause.png')} style={styles.buttonImage} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push(`/playList/CommentsPage?id=${id}`)}>
                                    <Image source={require('../images/comment.png')} style={styles.buttonImage} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    songInfoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    artwork: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 15,
    },
    songTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 5,
    },
    songArtist: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    lyricsContainer: {
        flex: 1,
        marginVertical: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
    },
    lyricLine: {
        height: 60, // 固定每行高度
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    lyricsText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 24,
    },
    currentLyricText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 26,
        color:'red',
    },
    translationText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        lineHeight: 20,
    },
    bottomContainer: {
        width: '100%',
        paddingBottom: 30,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 30,
    },
    buttonImage: {
        width: 35,
        height: 35,
        tintColor: '#ffffff',
    },
});

export default MusicPlayer; 