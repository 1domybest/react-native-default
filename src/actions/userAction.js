import {createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import {Alert} from 'react-native'
import * as $Util from '../constants/utils'
import {ROUTES} from '../constants/routes'

const emailDoubleCheck = (data) => {
     return new Promise(function (resolve, reject) {
        axios.post('http://localhost:8080/api/common/user/userEmailDoubleCheck', data, {withCredentials: true})
        .then(async function(res) {
            resolve(res);
        }).catch ((error) => {
            reject (error.response.data) ;
            alert(error.response.data.message);
        })
     })
}

const register = async (params, navigation) => {
    return new Promise(function (resolve, reject) {
        axios.post('http://localhost:8080/api/common/user/register', params, {withCredentials: true})
        .then(async function(res) {
            console.log(res.data)
            if (res.data.code === 200) {
                let result =  {
                    accessToken: res.headers.accesstoken,
                    refreshToken: res.headers.refreshtoken,
                    loading: false,
                }
                await $Util.setStoreData('token', result);
                Alert.alert(
                    res.data.message,
                    '완료',
                    [
                        {text: '확인'}
                    ]
                )
                resolve(result)
            }
        }).catch ((error) => {
            reject (error.response.data);
            alert(error.response.data.message);
        })
    })
}


const sendEmailAuthCode = async (email, navigation) => {
    return new Promise(function (resolve, reject) {
        axios.post('http://localhost:8080/api/common/user/sendEmailAuthCode', {to: email}, {withCredentials: true})
        .then(async function(res) {
            if (res.data.code === 200) {
                Alert.alert(
                    res.message,
                    '인증',
                    [
                        {text: '확인', onPress: () => navigation.navigate(ROUTES.REGISTEREMAILAUTHVALIDATION, {emailAuthCode: res.data.data.emailAuthCode, email: email})}
                    ]
                )
            }
            resolve(res.data);
        }).catch ((error) => {
            alert(error.response.data.message);
            reject (error.response.data) ;
        })
    })
}

const temporaryPassword = async (email, navigation) => {
    return new Promise(function (resolve, reject) {
        axios.post('http://localhost:8080/api/common/user/temporaryPassword', {to: email}, {withCredentials: true})
        .then(async function(res) {
            console.log(res.data)
            if (res.data.code === 200) {
                Alert.alert(
                    res.data.message,
                    '인증',
                    [
                        {text: '확인', onPress: () => navigation.navigate(ROUTES.INDEX)}
                    ]
                )
            }
            resolve(res.data.data.emailAuthCode);
        }).catch ((error) => {
            alert(error.response.data.message);
            reject (error.response.data) ;
        })
    })
}

const login = async (params) => {
    return new Promise (function (resolve, reject) {
     axios.post('http://localhost:8080/api/common/user/login', params, {withCredentials: true})
        .then(async function(res) {
            if (res.data.code === 200) {
                let result =  {
                    accessToken: res.headers.accesstoken,
                    refreshToken: res.headers.refreshtoken,
                    loading: false,
                }
                $Util.setStoreData('token', {
                    accessToken: res.headers.accesstoken,
                    refreshToken: res.headers.refreshtoken,
                });
                Alert.alert(
                    res.data.message,
                    '완료',
                    [
                        {text: '확인'}
                    ]
                )
                resolve(result);
            }
        }).catch(error => {
            Alert.alert(error.response.data.message);
            reject (error.response.data) ;
        })
    })
}

const snsLogin = async (params) => {
    return new Promise (function (resolve, reject) {
     axios.post('http://localhost:8080/api/common/user/snsLogin', params, {withCredentials: true})
        .then(async function(res) {
            if (res.data.code === 200) { // 정상 코드가 들어올시 비지니스로직 진행
                let result =  {
                    accessToken: res.headers.accesstoken,
                    refreshToken: res.headers.refreshtoken,
                    loading: false,
                }
                $Util.setStoreData('token', {
                    accessToken: res.headers.accesstoken,
                    refreshToken: res.headers.refreshtoken,
                });

                Alert.alert(
                    res.data.message,
                    '로그인',
                    [
                        {text: '확인'}
                    ]
                )
                resolve(result);
            }
        }).catch(error => {
            reject (error.response.data)
            if (error.response.data.code !== 426) { // 일반회원이 아니면
                alert(error.response.data.message);
            } else {
                Alert.alert(
                    error.response.data.message,
                    'sns 로그인 연동하기',
                    [
                        {
                            text: '연동하기',
                            onPress: async () => await updateProvider(params)
                        },
                        {
                            text: '취소',
                            style: "cancel"
                        },
                    ],
                    { cancelable: false }
                )
            }
            
        })
    })
}

const updateProvider = async (params) => {
    await axios.post('http://localhost:8080/api/common/user/updateProvider', params, {withCredentials: true})
    .then(function(res) {
        if (res.data.code === 200) { // 정상 코드가 들어올시 비지니스로직 진행
            snsLogin(params)
        }
    }).catch(error => {
        alert(error.response.data.message);
    })
}

const logOutRequest = createAsyncThunk('userLogOut', async (navigation, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    // try catch 는 하지말아야 에러를 캐치할수 있다.
    // 상단 파라미터중 data는 요청시 들어온 파라미터이다. 저 파라미터를 가지고 서버에 데이터 요청하면된다.
    //const state = getState(); // 상태가져오기
    let data = {
        accessToken: null,
        refreshToken: null,
    }
    await $Util.setStoreData("token", data)
    return data;
})

const temporaryPasswordRequest = createAsyncThunk('temporaryPassword', async (params, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    let result = await temporaryPassword(params.email, params.navigation)
    return result;
})


const sendEmailAuthCodeRequest = createAsyncThunk('sendEmailAuthCode', async (params, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    let result = sendEmailAuthCode(params.email, params.navigation);
    return result;
})

const loginRequset = createAsyncThunk('login', async (params, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    // try catch 는 하지말아야 에러를 캐치할수 있다.
    // 상단 파라미터중 data는 요청시 들어온 파라미터이다. 저 파라미터를 가지고 서버에 데이터 요청하면된다.
    //const state = getState(); // 상태가져오기
    login(params).then(function(res) {
       return res;
    })
})

const snsLoginRequset = createAsyncThunk('userLogIn', async (params, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    // try catch 는 하지말아야 에러를 캐치할수 있다.
    // 상단 파라미터중 data는 요청시 들어온 파라미터이다. 저 파라미터를 가지고 서버에 데이터 요청하면된다.
    const state = getState(); // 상태가져오기

    let result = await snsLogin(params);

    return result;
})


const registerRequest = createAsyncThunk('register', async (params, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    let result = await register(params.data, params.navigation);
    return result;
})

const emailDoubleCheckRequest = createAsyncThunk('emailDoubleCheck', async (data, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
    let result = await emailDoubleCheck(data);
    if (result.data.code === 200) {
        let params = {navigation: data.navigation, email: data.email}
        dispatch(sendEmailAuthCodeRequest(params))
    }
    return true;
})



export {snsLoginRequset, logOutRequest, sendEmailAuthCodeRequest, temporaryPasswordRequest, registerRequest, emailDoubleCheckRequest, loginRequset}