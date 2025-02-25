import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LoggedInView from '../components/LoggedInView';
import withAuth from '../hoc/withAuth';
import CurrentTrackBar from '../components/CurrentTrackBar';

function HomeScreen() {



    return (
        <View style={styles.container}>
            <LoggedInView/>
            <View style={styles.trackBar}>
                <CurrentTrackBar/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DCE6F1',
        paddingBottom: 50,
    },
    trackBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default withAuth(HomeScreen);