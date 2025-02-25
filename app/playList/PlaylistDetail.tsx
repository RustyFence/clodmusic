import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';
import { apiUrl } from '../../config';
import { useLocalSearchParams, useRouter } from 'expo-router';

function PlaylistDetail() {
    const { id } = useLocalSearchParams(); // 获取传递的歌单ID
    const router = useRouter();
    const [trackIds, setTrackIds] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 10; // 每页加载的歌曲数量

    useEffect(() => {
        if (id) {
            // 调用API获取歌单详情
            axios.get(`${apiUrl}/playlist/detail`, { params: { id } })
                .then(response => {
                    setTrackIds(response.data.playlist.trackIds.map(track => track.id));
                })
                .catch(error => {
                    console.error('Error fetching playlist details:', error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (trackIds.length > 0) {
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            if (start > trackIds.length) {
                return;
            }
            const currentTrackIds = trackIds.slice(start, end); // 获取当前页的歌曲ID

            // 请求当前页的歌曲详情
            axios.get(`${apiUrl}/song/detail`, { params: { ids: currentTrackIds.join(',') } })
                .then(response => {
                    setTracks(prevTracks => [...prevTracks, ...response.data.songs]);
                    console.log("请求10首歌曲",response.data.songs);
                })
                .catch(error => {
                    console.error('Error fetching song details:', error);
                });
        }
    }, [trackIds, page]);

    const loadMoreTracks = () => {
        setPage(prevPage => prevPage + 1);
    };

    const renderTrackItem = ({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/playList/MusicPlayer?id=${item.id}`)}>
            <View style={styles.trackItem}>
                <Image source={{ uri: item.al.picUrl }} style={styles.coverImage} />
                <View style={styles.textContainer}>
                    <Text style={styles.trackName}>
                        {item.name}
                        {item.tns && item.tns.length > 0 ? ` (${item.tns.join(', ')})` : ''}
                    </Text>
                    <Text style={styles.artistName}>{item.ar.map(artist => artist.name).join(', ')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground 
            source={require('../images/bg1.jpg')} 
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>歌单详情</Text>
                <FlatList
                    data={tracks}
                    renderItem={renderTrackItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    onEndReached={loadMoreTracks}
                    onEndReachedThreshold={0.5}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 20,
        marginHorizontal: 15,
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    coverImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    trackName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        marginBottom: 6,
    },
    artistName: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
});

export default PlaylistDetail; 