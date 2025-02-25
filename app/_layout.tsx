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
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                    height: 60,
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
                headerBackTitleVisible: false,
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="playList/PlaylistDetail" 
                options={{ 
                    title: '歌单详情',
                    headerTransparent: true,
                    headerBlurEffect: 'dark',
                }} 
            />
            <Stack.Screen 
                name="playList/MusicPlayer" 
                options={{ 
                    title: '音乐播放',
                    headerTransparent: true,
                    headerBlurEffect: 'dark',
                }} 
            />
        </Stack>
    );
}
