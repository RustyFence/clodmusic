import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';
import { apiUrl } from '../../config';
import CurrentTrackBar from '../components/CurrentTrackBar';
import { useRouter } from 'expo-router';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [defaultKeyword, setDefaultKeyword] = useState('');
    const [hotKeywords, setHotKeywords] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDefaultKeyword = async () => {
            try {
                const response = await axios.get(`${apiUrl}/search/default`);
                setDefaultKeyword(response.data.data.realkeyword);
            } catch (err) {
                console.error('Error fetching default keyword:', err);
            }
        };

        const fetchHotKeywords = async () => {
            try {
                const response = await axios.get(`${apiUrl}/search/hot`);
                setHotKeywords(response.data.result.hots);
            } catch (err) {
                console.error('Error fetching hot keywords:', err);
            }
        };

        fetchDefaultKeyword();
        fetchHotKeywords();
    }, []);

    const handleSearch = async () => {
        const searchQuery = query.trim() || defaultKeyword;
        try {
            const response = await axios.get(`${apiUrl}/cloudsearch`, {
                params: { keywords: searchQuery, limit: 30, type: 1 },
            });
            setResults(response.data.result.songs || []);
        } catch (err) {
            setError(err.message);
            console.error('Error performing search:', err);
        }
    };

    const renderResultItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => router.push(`/playList/MusicPlayer?id=${item.id}`)}>
            <Image source={{ uri: item.al?.picUrl }} style={styles.coverImage} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.artist}>{item.artists?.map(artist => artist.name).join(', ')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground 
            source={require('../images/bg1.jpg')} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={`搜索 ${defaultKeyword}`}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                />
                <Text style={styles.header}>热门搜索</Text>
                <FlatList
                    data={hotKeywords}
                    renderItem={({ item }) => <Text style={styles.hotKeyword}>{item.first}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
                <Text style={styles.header}>搜索结果</Text>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <FlatList
                        data={results}
                        renderItem={renderResultItem}
                        keyExtractor={item => item.id.toString()}
                    />
                )}
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
        padding: 15,
    },
    searchInput: {
        height: 45,
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#ffffff',
        fontSize: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
        marginVertical: 15,
        opacity: 0.9,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    coverImage: {
        width: 55,
        height: 55,
        borderRadius: 8,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        marginBottom: 4,
    },
    artist: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    hotKeyword: {
        fontSize: 14,
        color: '#ffffff',
        marginRight: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        height: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    errorText: {
        fontSize: 16,
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: 20,
    },
    trackBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default SearchPage; 