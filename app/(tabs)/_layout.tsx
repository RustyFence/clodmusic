import React from 'react';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffffff', // 活动标签为白色
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // 非活动标签为半透明白色
                tabBarStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 深色半透明背景
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    height: 60,
                    paddingBottom: 8,
                },
                headerStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 深色半透明背景
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                    height: 60,
                },
                headerTintColor: '#ffffff', // 标题文字为白色
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: '首页',
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../images/home.png')} 
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="MyPlaylists" 
                options={{ 
                    title: '我的歌单',
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../images/playlist.png')} 
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="DailyRecommendations" 
                options={{ 
                    title: '每日推荐',
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../images/recommend.png')} 
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="Search" 
                options={{ 
                    title: '搜索',
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../images/search.png')} 
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                }} 
            />
        </Tabs>
    );
}