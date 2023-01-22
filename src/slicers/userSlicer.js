import { createSlice } from '@reduxjs/toolkit' // toolkit 추가된 임포트
import {snsLoginRequset, logOutRequest, sendEmailAuthCodeRequest, registerRequest, emailDoubleCheckRequest} from '../actions/userAction'

const initialState = {
    accessToken: null,
    refreshToken: null,
    loading: false,
}

const userSlicer = createSlice({
    name: 'userSlicer',
    initialState: initialState,
    reducers: { // 동기적인  액션을 넣는다.   내부적인 액션
        setToken (state, action) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setIsExistEmail (state, action) {
            state.isExistEmail = action.payload.isExistEmail;
        },
        setEmail (state, action) {
           state.email = action.payload.email
           console.log(action.payload.email)
        }
    },
    extraReducers: (builder) => { // 비동적인 엑션을 넣는다  외부적인 액션 (예를들어 userSlice에서 post의 액션을 써야할때 이곳에 적는데 그때는 동기가아니고 비동기여도 넣는다.)
        builder.addCase(registerRequest.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(registerRequest.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.loading = false;
        });
        builder.addCase(registerRequest.rejected, (state, action) => {
            state.loading = false;
            state.accessToken = null;
            state.refreshToken = null;
        });
        builder.addCase(snsLoginRequset.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(snsLoginRequset.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.loading = false;
        });
        builder.addCase(snsLoginRequset.rejected, (state, action) => {
            state.loading = false;
            state.accessToken = null;
            state.refreshToken = null;
        });
        builder.addCase(logOutRequest.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(logOutRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        });
        builder.addCase(logOutRequest.rejected, (state, action) => {
            state.loading = false;
            state.accessToken = null;
            state.refreshToken = null;
        });
    },
});
export default userSlicer;