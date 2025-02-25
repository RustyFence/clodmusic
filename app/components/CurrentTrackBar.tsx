import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import TrackPlayer, { useTrackPlayerEvents, Event, State, usePlaybackState } from 'react-native-track-player';
import { useRouter } from 'expo-router';
const CurrentTrackBar = () => {
    const router = useRouter();
    const [trackTitle, setTrackTitle] = useState('');
    const [trackArtist, setTrackArtist] = useState('');
    const [trackArtwork, setTrackArtwork] = useState('');
    const playbackState = usePlaybackState();

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artist, artwork } = track || {};
            setTrackTitle(title || 'Unknown Title');
            setTrackArtist(artist || 'Unknown Artist');
            setTrackArtwork(artwork || '');
        }
    });

    useEffect(() => {
        const updateTrackInfo = async () => {
            const currentTrack = await TrackPlayer.getCurrentTrack();
            if (currentTrack !== null) {
                const track = await TrackPlayer.getTrack(currentTrack);
                const { title, artist, artwork } = track || {};
                setTrackTitle(title || 'Unknown Title');
                setTrackArtist(artist || 'Unknown Artist');
                setTrackArtwork(artwork || '');
            }
        };

        updateTrackInfo();
    }, [playbackState]);

    const handlePress = async () => {
        const activeTrack = await TrackPlayer.getActiveTrack();
        console.log(activeTrack);
        const trackId = activeTrack?.id;
        console.log(trackId);
        router.push(`/playList/MusicPlayer?id=${trackId}`)
    }


    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            {trackArtwork ? <Image source={{ uri: trackArtwork }} style={styles.artwork} /> : null}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{trackTitle}</Text>
                <Text style={styles.artist}>{trackArtist}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        height: 75,
    },
    artwork: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    artist: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
});

export default CurrentTrackBar; 