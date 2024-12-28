import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LoggedInView from '../components/LoggedInView';
import withAuth from '../hoc/withAuth';

function HomeScreen() {



    return (
        <View style={styles.container}>
            <LoggedInView/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DCE6F1',
    },
});

export default withAuth(HomeScreen);