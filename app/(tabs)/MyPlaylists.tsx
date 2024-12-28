import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { apiUrl } from '../../config';
import { useRouter } from 'expo-router';
import withAuth from '../hoc/withAuth';
import { storage } from '../../utils/storage';

function MyPlaylists() {
    const [playlists, setPlaylists] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPlaylists = async () => {
            const storedLoginStatus = await storage.getItem('loginStatus');
            if (storedLoginStatus) {
                const parsedStatus = JSON.parse(storedLoginStatus);
            const userId = parsedStatus.data.account.id;

            axios.get(`${apiUrl}/user/playlist?uid=${userId}`)
                .then(response => {
                    setPlaylists(response.data.playlist);
                })
                .catch(error => {
                    console.error('Error fetching playlists:', error);
                });
            }
        };

        fetchPlaylists();
    }, []);

    const handlePlaylistPress = (id: number) => {
        router.push(`/playList/PlaylistDetail?id=${id}`);
    };

    const renderPlaylistItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handlePlaylistPress(item.id)}>
            <View style={styles.playlistItem}>
                <Image source={{ uri: item.coverImgUrl }} style={styles.coverImage} />
                <View style={styles.textContainer}>
                    <Text style={styles.playlistName}>{item.name}</Text>
                    <Text style={styles.trackCount}>{item.trackCount} 首歌曲</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>我的歌单</Text>
            <FlatList
                data={playlists}
                renderItem={renderPlaylistItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
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
    playlistItem: {
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
    playlistName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    trackCount: {
        fontSize: 14,
        color: '#666',
    },
});

export default withAuth(MyPlaylists); 