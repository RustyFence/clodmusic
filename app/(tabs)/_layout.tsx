import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#5A9BD5', // 活动标签的颜色（柔和的蓝色）
                tabBarInactiveTintColor: '#FFFFFF', // 非活动标签的颜色（白色）
                tabBarStyle: {
                    backgroundColor: '#DCE6F1', // 标签栏的背景色（淡蓝色）
                },
                headerStyle: {
                    backgroundColor: '#DCE6F1', // 标题栏的背景色（淡蓝色）
                },
                headerTintColor: '#5A9BD5', // 标题栏文字颜色（柔和的蓝色）
            }}
        >
            <Tabs.Screen name="index"  options={{ title: '首页' }} />
            <Tabs.Screen name="MyPlaylists"  options={{ title: '我的歌单' }} />
            <Tabs.Screen name="DailyRecommendations"  options={{ title: '每日推荐' }} />
            <Tabs.Screen name="PrivateFM"  options={{ title: '私人漫游' }} />
            <Tabs.Screen name="Search"  options={{ title: '搜索' }} />
        </Tabs>
    );
}