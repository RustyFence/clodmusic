import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { apiUrl } from '../../config';

function MusicPlayer() {
    const { id } = useLocalSearchParams(); // 获取传递的音乐ID
    const [error, setError] = useState(null);
    const [songUrl, setSongUrl] = useState(null);
    const [lyrics, setLyrics] = useState([]);
    const [animatedValues, setAnimatedValues] = useState([]);
    const { position, duration } = useProgress(); // 获取播放进度和总时长

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                // 获取音乐 URL
                const songResponse = await axios.get(`${apiUrl}/song/url/v1`, {
                    params: { id, level: 'standard' }
                });

                const url = songResponse.data.data[0]?.url;
                if (!url) {
                    throw new Error('无法获取音乐 URL');
                }
                setSongUrl(url);

                // 获取歌词
                const lyricResponse = await axios.get(`${apiUrl}/lyric/new`, {
                    params: { id }
                });

                const parsedLyrics = parseLyrics(lyricResponse.data.lrc?.lyric || '');
                setLyrics(parsedLyrics);
                setAnimatedValues(parsedLyrics.map(() => new Animated.Value(0)));
            } catch (err) {
                setError(err.message);
                console.error('Error fetching song data:', err);
            }
        };

        fetchSongData();
    }, [id]);

    const handlePlay = async () => {
        try {
            await TrackPlayer.add({
                id: id,
                url: songUrl,
                title: 'Song Title',
                artist: 'Artist Name',
                artwork: 'https://example.com/cover.jpg',
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

    const parseLyrics = (lyrics) => {
        return lyrics.split('\n').map(line => {
            const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = parseInt(match[3], 10) * 10;
                const text = match[4];
                const timestamp = minutes * 60 + seconds + milliseconds / 1000;
                return { timestamp, text };
            }
            return { timestamp: 0, text: line };
        });
    };

    const getCurrentLyricIndex = () => {
        return lyrics.findIndex(line => line.timestamp > position) - 1;
    };

    const currentLyricIndex = getCurrentLyricIndex();

    useEffect(() => {
        if (currentLyricIndex >= 0 && currentLyricIndex < animatedValues.length) {
            Animated.timing(animatedValues[currentLyricIndex], {
                toValue: 1,
                duration: 2000, // 动画持续时间
                useNativeDriver: true,
            }).start();
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
            <Text style={styles.title}>音乐播放</Text>
            {songUrl && (
                <View style={styles.controls}>
                    <Button title="播放" onPress={handlePlay} />
                    <Button title="暂停" onPress={handlePause} />
                </View>
            )}
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={handleSeek}
                minimumTrackTintColor="#5A9BD5"
                maximumTrackTintColor="#000000"
            />
            <ScrollView style={styles.lyricsContainer}>
                {lyrics.map((line, index) => (
                    <Animated.Text
                        key={index}
                        style={[
                            styles.lyricsText,
                            index === currentLyricIndex && {
                                opacity: animatedValues[index],
                            },
                        ]}
                    >
                        {line.text}
                    </Animated.Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCE6F1',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5A9BD5',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginVertical: 20,
    },
    slider: {
        width: 300,
        height: 40,
        marginVertical: 20,
    },
    lyricsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        maxHeight: 200,
    },
    lyricsText: {
        fontSize: 16,
        color: '#333',
    },
});

export default MusicPlayer; 