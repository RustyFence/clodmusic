import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import NotLoggedInView from '../components/NotLoggedInView';
import { storage } from '../../utils/storage';

function withAuth(Component: React.ComponentType<any>) {
    return function AuthenticatedComponent() {
        const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

        useEffect(() => {
            const fetchLoginStatus = async () => {
                const storedLoginStatus = await storage.getItem('loginStatus');
                const isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus).data.code === 200 : false;
                setIsLoggedIn(isLoggedIn);
            };

            fetchLoginStatus();
        }, []);

        if (isLoggedIn === null) {
            return <View><Text>Loading...</Text></View>;
        }

        if (!isLoggedIn) {
            return <NotLoggedInView />;
        }

        return <Component />;
    };
}

export default withAuth; 