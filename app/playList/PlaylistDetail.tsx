import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
            const start = page * pageSize;
            const end = start + pageSize;
            if (start > trackIds.length) {
                return;
            }
            const currentTrackIds = trackIds.slice(start, end); // 获取当前页的歌曲ID

            // 请求当前页的歌曲详情
            axios.get(`${apiUrl}/song/detail`, { params: { ids: currentTrackIds.join(',') } })
                .then(response => {
                    setTracks(prevTracks => [...prevTracks, ...response.data.songs]);
                    console.log(response.data.songs);
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
        <View style={styles.container}>
            <Text style={styles.title}>歌单详情</Text>
            <FlatList
                data={tracks}
                renderItem={renderTrackItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                onEndReached={loadMoreTracks}// 加载更多
                onEndReachedThreshold={0.5}// 加载更多阈值
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DCE6F1',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5A9BD5',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    coverImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    trackName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    artistName: {
        fontSize: 14,
        color: '#666',
    },
});

export default PlaylistDetail; 