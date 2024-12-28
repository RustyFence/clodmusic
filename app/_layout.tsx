import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import TrackPlayer from 'react-native-track-player';

export default function AppLayout() {
    useEffect(() => {
        let isPlayerSetup = false;
        
        const setupPlayer = async () => {
            try {
                await TrackPlayer.setupPlayer();
                console.log('Track Player initialized');
                isPlayerSetup = true;
            } catch (error) {
                console.error('Error initializing Track Player:', error);
            }
        };
        setupPlayer();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="playList/PlaylistDetail" options={{ headerShown: true }} />
            <Stack.Screen name="playList/MusicPlayer" options={{ title: '音乐播放' }} />
        </Stack>
    );
}
