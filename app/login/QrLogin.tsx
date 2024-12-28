import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { apiUrl } from '../../config';
import { storage } from '../../utils/storage';

function QrLogin() {
    const router = useRouter();
    const [qrKey, setQrKey] = useState<string | null>(null);
    const [qrData, setQrData] = useState<string | null>(null);
    const [loginStatus, setLoginStatus] = useState<string>('Waiting for scan...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`${apiUrl}/login/qr/key`, { params: { timestamp: Date.now() } })
            .then(response => {
                if (response.data.code === 200) {
                    setQrKey(response.data.data.unikey);
                } else {
                    setError('Failed to generate QR key');
                }
            })
            .catch(() => {
                setError('Error generating QR key');
            });
    }, []);

    useEffect(() => {
        if (qrKey) {
            axios.get(`${apiUrl}/login/qr/create`, { params: { key: qrKey, qrimg: true, timestamp: Date.now() } })
                .then(response => {
                    if (response.data.code === 200) {
                        setQrData(response.data.data.qrimg);
                    } else {
                        setError('Failed to generate QR code');
                    }
                })
                .catch(() => {
                    setError('Error generating QR code');
                });

            const interval = setInterval(() => {
                axios.get(`${apiUrl}/login/qr/check`, { params: { key: qrKey, timestamp: Date.now() } })
                    .then(response => {
                        switch (response.data.code) {
                            case 800:
                                setLoginStatus('QR Code expired');
                                clearInterval(interval);
                                break;
                            case 801:
                                setLoginStatus('Waiting for scan...');
                                break;
                            case 802:
                                setLoginStatus('Waiting for confirmation...');
                                break;
                            case 803:
                                setLoginStatus('Login successful!');
                                clearInterval(interval);
                                const receivedCookie = response.data.cookie;
                                storage.setItem('cookie', receivedCookie);
                                getLoginStatus(receivedCookie);
                                break;
                            default:
                                setLoginStatus('Unknown status');
                        }
                    })
                    .catch(() => {
                        setError('Error checking QR code status');
                        clearInterval(interval);
                    });
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [qrKey]);

    const getLoginStatus = async (cookie: string) => {
        try {
            const response = await axios.post(`${apiUrl}/login/status`, { cookie, timestamp: Date.now() });
            console.log('Login Status:', response.data);
            storage.setItem('loginStatus', JSON.stringify(response.data));
            router.replace('(tabs)');    
        } catch (error) {
            console.error('Error fetching login status:', error);
        }
    };

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>Error: {error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QR Code Login</Text>
            {qrData ? (
                <Image source={{ uri: qrData }} style={styles.qrImage} />
            ) : (
                <Text style={styles.loadingText}>Loading QR Code...</Text>
            )}
            <Text style={styles.statusText}>{loginStatus}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCE6F1',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5A9BD5',
        marginBottom: 20,
    },
    qrImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    statusText: {
        fontSize: 16,
        color: '#5A9BD5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8D7DA',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#721C24',
    },
});

export default QrLogin; 