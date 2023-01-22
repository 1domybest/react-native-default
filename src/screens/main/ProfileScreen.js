import { View, Text } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native'
import { Button } from '@rneui/base';
import * as $Util from '../../constants/utils'
import {ROUTES} from '../../constants/routes'
const ProfileScreen = () => {
    const navigation = useNavigation();
    const logOut = () => {
        $Util.removeStoreData('token');
        navigation.replace(ROUTES.INDEX)
    }
    return (
        <SafeAreaView>
            <View>
                <Text>프로필</Text>
                <Button onPress={() => logOut()}>로그아웃</Button>
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen

const useStyles = makeStyles((theme, props) => ({
}));