import React from 'react';
import { View, Text } from 'react-native';
import { apiUrl } from '../../config';
import withAuth from '../hoc/withAuth';

function DailyRecommendations() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Daily Recommendations Page</Text>
        </View>
    );
}

export default withAuth(DailyRecommendations); 