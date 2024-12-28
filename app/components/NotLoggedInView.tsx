import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../../utils/storage';

function NotLoggedInView() {
    const router = useRouter();
    const loginStatus = storage.getItem('loginStatus');
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.infoText}>当前状态未登录，除搜索外功能无法使用</Text>
                <Button title="二维码登录" onPress={() => router.push('login/QrLogin')} color="#5A9BD5" />
                <Text style={styles.infoText}>登录信息</Text>
                <Text style={styles.jsonData}>
                    {JSON.stringify(loginStatus, null, 2)}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DCE6F1',
    },
    scrollView: {
        padding: 20,
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

export default NotLoggedInView; 