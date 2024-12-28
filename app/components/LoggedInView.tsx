import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../../utils/storage';

function LoggedInView() {
    const router = useRouter();
    const [loginStatus, setLoginStatus] = useState(null);

    useEffect(() => {
        const fetchLoginStatus = async () => {
            const status = await storage.getItem('loginStatus');
            if (status) {
                setLoginStatus(JSON.parse(status));
            }
        };

        fetchLoginStatus();
    }, []);

    const handleLogout = () => {
        storage.removeItem('loginStatus');
        router.back();
    };

    if (!loginStatus) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.userInfo}>
                <Text style={styles.nickname}>当前用户:</Text>
                <Image
                    source={{ uri: loginStatus.data.profile.avatarUrl }}
                    style={styles.avatar}
                />
                <Text style={styles.nickname}> {loginStatus.data.profile.nickname}</Text>
            </View>
            <Text style={styles.infoText}>登录信息</Text>
            <Text style={styles.jsonData}>
                {JSON.stringify(loginStatus.data, null, 2)}
            </Text>
            <Button title="登出" onPress={handleLogout} color="#5A9BD5" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        padding: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        borderColor: '#5A9BD5',
        borderWidth: 2,
    },
    nickname: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5A9BD5',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    jsonData: {
        margin: 10,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        color: '#333',
        fontFamily: 'monospace',
    },
});

export default LoggedInView; 