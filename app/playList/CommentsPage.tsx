import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { apiUrl } from '../../config';

function CommentsPage() {
    const { id } = useLocalSearchParams(); // 获取传递的音乐ID
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentResponse = await axios.get(`${apiUrl}/comment/music`, {
                    params: { id, limit: 20 }
                });
                setComments(commentResponse.data.comments);
            } catch (err) {
                setError('Error fetching comments');
                console.error(err);
            }
        };

        fetchComments();
    }, [id]);

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ImageBackground 
            source={require('../images/bg1.jpg')} 
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.title}>评论</Text>
                    {comments.map((comment, index) => (
                        <View key={index} style={styles.comment}>
                            <Image source={{ uri: comment.user.avatarUrl }} style={styles.avatar} />
                            <View style={styles.commentContent}>
                                <Text style={styles.commentUser}>{comment.user.nickname}</Text>
                                <Text style={styles.commentText}>{comment.content}</Text>
                                <Text style={styles.commentTime}>
                                    {new Date(comment.time).toLocaleString()}
                                </Text>
                                {comment.translatedContent && (
                                    <Text style={styles.commentTranslation}>
                                        翻译: {comment.translatedContent}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}
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
        flex: 1,
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: 20,
    },
    comment: {
        flexDirection: 'row',
        marginBottom: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 23,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 6,
    },
    commentText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 20,
    },
    commentTime: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 8,
    },
    commentTranslation: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 8,
        fontStyle: 'italic',
    },
});

export default CommentsPage; 