// lib/FFmpeg.js
import {FFmpegKit, FFmpegKitConfig, ReturnCode, FFprobeKit, FFprobeSessionCompleteCallback, Log} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

import {
  FRAME_PER_SEC, // 몇초마다 끊을것인지
  FRAME_WIDTH, // 하나의 프레임당 width 길이 [노란색 border 의 프레임을 뜻함]
} from '../screens/main/Camera';

class FFmpegWrapper {
  static getFrames(
    localFileName,
    videoURI,
    frameNumber,
    successCallback,
    errorCallback,
  ) {
    let outputPath = `${RNFS.CachesDirectoryPath}/${localFileName}_%4d.png`; // 업로드된 파일을 캐싱하여 각 초마다 저장했을때의 path 를 등록
    const ffmpegCommand = `-v quiet -ss 0 -i ${videoURI} -vf "fps=${FRAME_PER_SEC}/1:round=up,scale=${FRAME_WIDTH}:-2" -vframes ${frameNumber} ${outputPath}`;
    excute(ffmpegCommand, outputPath,successCallback, errorCallback);
  }

  static getAudio(
    localFileName,
    videoURI,
    successCallback,
    errorCallback,
  ) {
    let outputPath = `${RNFS.CachesDirectoryPath}/${localFileName}_%4d.mp3`; // 업로드된 파일을 캐싱하여 각 초마다 저장했을때의 path 를 등록
    const ffmpegCommand = `-v quiet -select_streams v -show_entries packet=size:stream=duration -of compact=p=0:nk=1 ${videoURI}` // 윈도우에서는 됨
    audio(ffmpegCommand,successCallback, videoURI)
  }
}

const audio = async (command,successCallback, videoURI) => {
  FFprobeKit.executeAsync(command, async session => {
    const log = session.getOutput();
    log.then(res => {
      var bitRates = res.split('\n')
      var heightestRate = Math.max.apply(Math, bitRates);
      successCallback({bitRates: bitRates, heightestRate: heightestRate});
    })
  })
}

const excute = (ffmpegCommand, outputPath,successCallback, errorCallback) => {
  FFmpegKit.executeAsync( // FFmpegKit 라이브러리의 비동기 실행함수 시작
  ffmpegCommand, // 작성한 커맨드를 실행 이해하기 쉽게 풀면 sql query 날렸다 생각하면 쉬움 
  async session => { // 비동기후 response 반환
    const state = FFmpegKitConfig.sessionStateToString( // 상태를 String 형태로 변환
      await session.getState(), // 세션의 상태를 받아옴
    );
    const returnCode = await session.getReturnCode(); // 세션의 response 확인
    const failStackTrace = await session.getFailStackTrace(); // 실패시 호출이 시작된시점부터 예외가 발생할때까지의 함수 목록반환 (디버깅용임)
    const duration = await session.getDuration(); // 걸린 시간 반환
    if (ReturnCode.isSuccess(returnCode)) { // 성공적으로 처리되었다면
      console.log(
        `Encode completed successfully in ${duration} milliseconds;.`, // 처리되었다는 log 반환
      );
      console.log(`Check at ${outputPath}`); // 프레임이 저장된 위치
      successCallback(outputPath); // 이 getFrame 을 호출한 부분으로 callBack 쉽게 말하면 resolve 와 비슷하다
    } else { // 실패시 상태 반환
      console.log('Encode failed. Please check log for the details.');
      console.log(
        `Encode failed with state ${state} and rc ${returnCode}.${
          (failStackTrace, '\\n')
        }`,
      );
      errorCallback(); // reject 와 비슷한 에러 콜백 반환
    }
  },
  log => { // 로그
    console.log(log.getMessage());
  },
  statistics => { // 통계 같음
    console.log(statistics);
  },
).then(session =>
  console.log(
    `Async FFmpeg process started with sessionId ${session.getSessionId()}.`, // 세션 아이디
  ),
);
}

export default FFmpegWrapper;