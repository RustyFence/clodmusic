import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Button, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
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
        router.push('/login/QrLogin');
    };

    if (!loginStatus) {
        return <Text>Loading...</Text>;
    }

    return (
        <ImageBackground 
            source={require('../images/bg1.jpg')} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>当前用户:</Text>
                        <Image
                            source={{ uri: loginStatus.data.profile.avatarUrl }}
                            style={styles.avatar}
                        />
                        <Text style={styles.nickname}>{loginStatus.data.profile.nickname}</Text>
                    </View>
                    <Text style={styles.infoText}>登录信息</Text>
                    <View style={styles.jsonContainer}>
                        <Text style={styles.jsonData}>
                            {JSON.stringify(loginStatus.data, null, 2)}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.buttonText}>登出</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    },
    scrollView: {
        padding: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    label: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginRight: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    nickname: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    infoText: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 15,
        fontWeight: '500',
    },
    jsonContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    jsonData: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'monospace',
        fontSize: 14,
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default LoggedInView; 