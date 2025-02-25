import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../../utils/storage';

function NotLoggedInView() {
    const router = useRouter();
    const loginStatus = storage.getItem('loginStatus');
    return (
        <ImageBackground 
            source={require('../images/bg1.jpg')} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.infoText}>当前状态未登录，除搜索外功能无法使用</Text>
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => router.push('login/QrLogin')}
                    >
                        <Text style={styles.buttonText}>二维码登录</Text>
                    </TouchableOpacity>
                    <Text style={styles.infoText}>登录信息</Text>
                    <View style={styles.jsonContainer}>
                        <Text style={styles.jsonData}>
                            {JSON.stringify(loginStatus, null, 2)}
                        </Text>
                    </View>
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
    infoText: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    jsonContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    jsonData: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'monospace',
        fontSize: 14,
    },
});

export default NotLoggedInView; 