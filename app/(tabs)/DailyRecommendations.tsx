import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { apiUrl } from '../../config';
import withAuth from '../hoc/withAuth';
import CurrentTrackBar from '../components/CurrentTrackBar';
import { useRouter } from 'expo-router';
import { storage } from '../../utils/storage';

function DailyRecommendations() {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const getcookie = await storage.getItem('cookie');
                const playlistResponse = await axios.get(`${apiUrl}/recommend/resource`,{cookie:getcookie});
                const checkLogin = await axios.post(`${apiUrl}/login/status`, { cookie, timestamp: Date.now() });
                console.log(checkLogin);
                setPlaylists(playlistResponse.data.recommend);

                const songsResponse = await axios.get(`${apiUrl}/recommend/songlist/get/v2`);
                setSongs(songsResponse.data.dailySongs);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching recommendations:', err);
            }
        };

        fetchRecommendations();
    }, []);

    const renderPlaylistItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => router.push(`/playList/PlaylistDetail?id=${item.id}`)}>
            <Image source={{ uri: item.picUrl }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderSongItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => router.push(`/playList/MusicPlayer?id=${item.id}`)}>
            <Text style={styles.title}>{item.name} - {item.artists.map(artist => artist.name).join(', ')}</Text>
        </TouchableOpacity>
    );

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>每日推荐歌单</Text>
            <FlatList
                data={playlists}
                renderItem={renderPlaylistItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <Text style={styles.header}>每日推荐歌曲</Text>
            <FlatList
                data={songs}
                renderItem={renderSongItem}
                keyExtractor={item => item.id.toString()}
            />
            <CurrentTrackBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    item: {
        marginRight: 10,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    title: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default withAuth(DailyRecommendations); 