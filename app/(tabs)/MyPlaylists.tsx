import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';
import { apiUrl } from '../../config';
import { useRouter } from 'expo-router';
import withAuth from '../hoc/withAuth';
import { storage } from '../../utils/storage';
import CurrentTrackBar from '../components/CurrentTrackBar';
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
        <ImageBackground 
            source={require('../images/bg1.jpg')} 
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>我的歌单</Text>
                <FlatList
                    data={playlists}
                    renderItem={renderPlaylistItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
                <View style={styles.trackBar}>
                    <CurrentTrackBar/>
                </View>
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
        padding: 20,
    },
    trackBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 80,
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
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
    },
    playlistName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        marginBottom: 6,
    },
    trackCount: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
});

export default withAuth(MyPlaylists); 