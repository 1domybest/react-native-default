import { StyleSheet, Text, View, Image, Dimensions, useColorScheme } from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, Avatar, useThemeMode } from '@rneui/themed';
import { ROUTES } from '../../constants/routes'
import { snsLoginRequset } from '../../actions/userAction'
import { useDispatch, useSelector } from 'react-redux';
import * as $Util from '../../constants/utils'
import Video from "react-native-video";
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
const { windowHeight } = Dimensions.get("window").height;
const { windowWidth } = Dimensions.get("window").width;
const IndexScreen = (props) => {
    const { navigation } = props

    const dispatch = useDispatch();

    const { mode, setMode } = useThemeMode();


    useLayoutEffect(() => {
        // --------- 여기부터 -------------
        const isLogined = async () => { // <-- async 추가
            let token = await $Util.getStoreData('token');
            if (!$Util.isEmpty(token)) {
                console.log(token)
                if (!$Util.isEmpty(token.accessToken)) {
                    navigation.replace(ROUTES.MAIN);
                } else {
                    console.log('로그인한적 X')
                }
            } else {
                await $Util.setStoreData('token', { accessToken: null, refreshToken: null })
            }
        }
        isLogined(); // <----- 여기에서 만든함수를 한번만 호출
        // --------- 여기까지를 원함 -------------
    }, []);

    nowMode = useColorScheme();
    useEffect(() => {
        setMode(nowMode)
    }, []);

    const [isSigned, setIsSigned] = useState();

    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: Platform.OS === 'ios' ? '227092955567-htg4giscens7ek3e0fm53s376nrqgn88.apps.googleusercontent.com' : '227092955567-masfk09hr42qgi4bgthig8qirj7cm9q1.apps.googleusercontent.com'
    });

    const googleLogin = async () => {
        console.log('구글 로그인 시작');
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            let params = {};
            params['userName'] = userInfo.user.name;
            params['email'] = userInfo.user.email;
            params['provider'] = 'google';
            params['providerId'] = userInfo.user.id;

            dispatch(snsLoginRequset(params));

        } catch (error) {
            console.log(error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'black', position: 'relative'}}>
            
        </View>
    )
}

export default IndexScreen

const styles = StyleSheet.create({
    
})