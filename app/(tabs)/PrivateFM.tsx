import React from 'react';
import { View, Text } from 'react-native';
import { apiUrl } from '../../config';
import withAuth from '../hoc/withAuth';

function PrivateFM() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Private FM Page</Text>
        </View>
    );
}

export default withAuth(PrivateFM); 