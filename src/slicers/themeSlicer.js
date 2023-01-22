import { createSlice } from '@reduxjs/toolkit' // toolkit 추가된 임포트
import {snsLoginRequset, logOutRequest} from '../actions/userAction'

const initialState = {
    mode: 'light'
}

const themeSlicer = createSlice({
    name: 'themeSlicer',
    initialState: initialState,
    reducers: { // 동기적인  액션을 넣는다.   내부적인 액션
        setMode (state, action) {
            state.mode = action.payload.mode;
        },
    },
    extraReducers: (builder) => { // 비동적인 엑션을 넣는다  외부적인 액션 (예를들어 userSlice에서 post의 액션을 써야할때 이곳에 적는데 그때는 동기가아니고 비동기여도 넣는다.)
       
    },
});
export default themeSlicer;