import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  Dimensions,
  Pressable,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-crop-picker';
import { Button } from 'react-native-paper';
import Video from 'react-native-video';
import FFmpegWrapper from '../../constants/FFmpegWrapper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('screen').width; // 화면 width 사이즈
const SCREEN_HEIGHT = Dimensions.get('screen').height; // 화면 height 사이즈
export const FRAME_PER_SEC = 1; // 몇초마다 끊을것인지
export const FRAME_WIDTH = 40; // 하나의 프레임당 width 길이 [노란색 border 의 프레임을 뜻함]
const TILE_HEIGHT = 40; // 4 sec. 의 높이 길이
const TILE_WIDTH = FRAME_WIDTH; // 현재 노란색 프레임의 반크기

const DURATION_WINDOW_DURATION = 2; // 프레임 몇개를 사용할것인지 
const DURATION_WINDOW_BORDER_WIDTH = 4; // 테두리 굵기
const DURATION_WINDOW_WIDTH =
  DURATION_WINDOW_DURATION * 5 * TILE_WIDTH; // 총 노란색 프레임의 width 길이
const POPLINE_POSITION = '50%'; // 노란색 프레임 중간 노란색 divder 의 위치 선정 50% === center 

const getFileNameFromPath = path => { // 파일 이름 가져오는 함수
  const fragments = path.split('/');
  let fileName = fragments[fragments.length - 1];
  fileName = fileName.split('.')[0];
  return fileName;
};

const FRAME_STATUS = Object.freeze({
  LOADING: { name: Symbol('LOADING') },
  READY: { name: Symbol('READY') },
});

const Camera = () => {
  const [selectedVideo, setSelectedVideo] = useState(); 
  const [frames, setFrames] = useState();
  const [audioBitRates, setAudioBitRate] = useState([]); 
  const [heightestRate, setHeightestRate] = useState(null); 
  const [isPlaying, setisPlaying] = useState(false);
  const [playingScroll, setPlayScroll] = useState(null); 
  const [x, setX] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePressSelectVideoButton = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(videoAsset => {
      console.log(`Selected video ${JSON.stringify(videoAsset, null, 2)}`);
      setSelectedVideo({
        uri: videoAsset.sourceURL || videoAsset.path,
        localFileName: getFileNameFromPath(videoAsset.path),
        creationDate: videoAsset.creationDate,
      });
    });
  };

  const handleVideoLoad = async videoAssetLoaded => { // 영상이 업로드 된후 동작 videoAssetLoaded 안에는 들어온 영상의 정보가 담겨져있다.
    const numberOfFrames = Math.ceil(videoAssetLoaded.duration); // 영상의 초를 반올림함  5.758999824523926 -> 6
    setFrames( // 영상이 로드가된후 초마다 만들어진 프레임의 상태를 전부 loading 으로 채워준다.
      Array(numberOfFrames).fill({
        status: FRAME_STATUS.LOADING.name.description,
      }),
    );

    await FFmpegWrapper.getFrames( // 업로드된 영사을 FFmpeg Command 를 통하여 원하는 초마다 프레임을자르고 반환
      selectedVideo.localFileName, // 업로드된 영상의 이름
      selectedVideo.uri, // 업로드된 영상의 uri
      numberOfFrames, // 프레임의 갯수
      filePath => { // successCallback
        const _framesURI = []; // 각 프레임을 담을 배열
        for (let i = 0; i < numberOfFrames; i++) {
          _framesURI.push( // 각프레임을 하나하나 담는다. 
            `${filePath.replace('%4d', String(i + 1).padStart(4, 0))}`, // FFmpegWrapper 에서 지정한 outputImagePath 의 이름중 %4d' -> padStart 를 통해 받은 인덱스 예) 0,1,2,3 -> 0001 ,0002,0003,0004 로 변경후 교체
          );
        }
        const _frames = _framesURI.map(_frameURI => ({ // 받은 배열들을 다시 map으로 반복문을 돌려 프레임마다 uri 를 저장해주고 상태를 LOADING -> READY 으로 변경해준다.
          uri: _frameURI,
          status: FRAME_STATUS.READY.name.description,
        }));
        setFrames(_frames); // 변경된 값들을 useState 를통해 다시 저장
      },
    );
    await FFmpegWrapper.getAudio( // 업로드된 영사을 FFmpeg Command 를 통하여 원하는 초마다 프레임을자르고 반환
      selectedVideo.localFileName, // 업로드된 영상의 이름
      selectedVideo.uri, // 업로드된 영상의 uri
      res => { // successCallback
        console.log(res)
        var bitRates = res.bitRates
        var heightestRate = res.heightestRate
        setHeightestRate(heightestRate)
        setAudioBitRate(bitRates)
        // setAudio(filePath); // 변경된 값들을 useState 를통해 다시 저장
      },
    );
  };

  const onProgress = (e) => {
    if (isPlaying) {
      setX(e.currentTime * FRAME_WIDTH)
      playingScroll.scrollTo({x: e.currentTime * FRAME_WIDTH})
    }
  }

  const renderFrame = (frame, index) => {
    if (frame.status === FRAME_STATUS.LOADING.name.description) { // 받은 프레임의 상태가 LOADING 이라면
      return <View style={styles.loadingFrame} key={index} />; // 로딩중인 프레임 반환
    } else { // 받은 프레임의 상태가 READY 이라면
      var borderTopLeftRadius = 0;
      var borderBottomLeftRadius = 0;
      var borderTopRightRadius = 0;
      var borderBottomRightRadius = 0;
      if (index === 0) {
        borderTopLeftRadius = 10;
        borderBottomLeftRadius = 10;
      } else if (index === frames.length - 1) {
        borderTopRightRadius = 10;
        borderBottomRightRadius = 10;
      }
      return ( // 정상적인 프레임 반환
        <Image
          key={index}
          source={{ uri: 'file://' + frame.uri }} // 파일은 저장했지만 아이폰 기준으로 file://을 붙여줘야하므로 file 포함애서 반환
          style={{
            width: TILE_WIDTH,
            height: TILE_HEIGHT,
            borderTopLeftRadius: borderTopLeftRadius,
            borderBottomLeftRadius: borderBottomLeftRadius,
            borderTopRightRadius: borderTopRightRadius,
            borderBottomRightRadius: borderBottomRightRadius,
          }}
          // onLoad={() => { // 다되면 이미지가 반환됬다고 알림
          //   console.log('Image loaded');
          // }}
        />
      );
    }
  };

  const renderBitRateFrame = (bitRate, index) => {
    return (
      <View style={{flex: 1, justifyContent: 'center'}} key={index}>
        <Text style={{width: 1.35, height: (bitRate/heightestRate) * FRAME_WIDTH, backgroundColor: 'white'}}></Text>
      </View>
    )
  }

  const renderFrameSecond = (frame, index) => {
    var text = "•"
    if (index % 5 === 0) {
      text = index + "s"
    }
    return (
      <Text style={{ width: FRAME_WIDTH, color: 'white', fontSize: 10 }} key={index}>{text}</Text>
    )
  }

  const handleScroll = (data) => {    
    if (!isPlaying) {
      setX(data.nativeEvent.contentOffset.x)
      setCurrentTime(data.nativeEvent.contentOffset.x / (FRAME_WIDTH))
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      {selectedVideo ? ( // 선택된 비디오가 있다면
        <>
          <View style={styles.videoContainer}>
            <Video
              style={styles.video}
              resizeMode={'cover'}
              source={{ uri: selectedVideo.uri }}
              repeat={false}
              onLoad={handleVideoLoad}
              onEnd={(res) => setisPlaying(false)}
              onProgress={onProgress}
              paused={!isPlaying}
              currentTime={currentTime}
            />
          </View>
          {frames && (
            <View style={styles.durationWindowAndFramesLineContainer}>
              <View style={{ flexDirection: 'row', overflow: 'hidden', paddingVertical: 10 }}>
                <View style={{ zIndex: 10, backgroundColor: '#676666', width: FRAME_WIDTH + 10 }}>
                  <Text style={{ justifyContent: 'center', fontSize: 10, alignSelf: 'center', color: 'white' }}>
                    {parseInt(((x / FRAME_WIDTH) % 3600) / 60) + '.' + parseInt((x / FRAME_WIDTH) % 60) + '.' + parseInt(x % 100)}
                  </Text>
                </View>
                <View style={{ left: -x, flexDirection: 'row' }}>
                  <View style={{ width: FRAME_WIDTH * 2, backgroundColor: '#60000096' }}></View>
                  <View style={{ width: FRAME_WIDTH * frames.length, flexDirection: 'row' }}>
                    {frames.map((frame, index) => renderFrameSecond(frame, index))}
                  </View>
                  <View style={{ width: SCREEN_WIDTH, backgroundColor: '#60000096' }}></View>
                </View>
              </View>
              <ScrollView
                vertical
                bounces={true}
                style={{ width: DURATION_WINDOW_WIDTH * 2, overflow: 'hidden', height: SCREEN_HEIGHT * 0.2}}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: FRAME_WIDTH + 10}}>
                    <View style={{ height: FRAME_WIDTH, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5, backgroundColor: '#676666' }}>
                      <TouchableOpacity style={{}}>
                        <Ionicons name={"musical-notes"} color="white" size={25} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ height: FRAME_WIDTH, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5, backgroundColor: '#676666' }}>
                      <TouchableOpacity style={{}}>
                        <Ionicons name={"scan-sharp"} color="white" size={25} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ height: FRAME_WIDTH, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5, backgroundColor: '#676666' }}>
                      <TouchableOpacity style={{}}>
                        <Ionicons name={"mic"} color="white" size={25} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ height: FRAME_WIDTH, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5, backgroundColor: '#676666' }}>
                      <TouchableOpacity style={{}}>
                        <Ionicons name={"md-add"} color="white" size={25} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.popLineContainer}>
                    <View style={styles.popLine} />
                  </View>
                  <View>
                    <View style={{ marginBottom: 5 }}>
                      <ScrollView
                        ref={ref => setPlayScroll(ref)}
                        onScroll={handleScroll}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        bounces={true}
                        style={styles.framesLine}
                        scrollEventThrottle={1}>
                        <View style={{ width: FRAME_WIDTH * 2 }}></View>
                        <View>
                          <View style={{ flexDirection: 'row', borderRadius: 10, marginBottom: 5, height: FRAME_WIDTH}}>
                            {audioBitRates.map((frame, index) => renderBitRateFrame(frame, index))}
                          </View>
                          <View style={{ flexDirection: 'row', borderRadius: 10, marginBottom: 5 }}>
                            {frames.map((frame, index) => renderFrame(frame, index))}
                          </View>
                        </View>
                        <View style={{ width: FRAME_WIDTH * 8 - 10 }}></View>
                      </ScrollView>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={{
                width: SCREEN_WIDTH,
                shadowColor: "black",
                shadowOffset: {
                  width: 0,
                  height: -10,
                },
                shadowOpacity: 0.9,
              }}>
                <View style={{ width: SCREEN_WIDTH, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 25,alignItems: 'center' }}>
                  <View>
                    <TouchableOpacity style={{}}>
                      <Ionicons name={"ios-options-sharp"} color="white" size={25} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SCREEN_WIDTH * 0.45,alignItems: 'center' }}>
                    <View>
                      <TouchableOpacity style={{}}>
                        <Ionicons name={"play-skip-back"} color="white" size={25} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style={{}}>
                        <Ionicons name={"radio-button-on"} color="red" size={55} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => setisPlaying(!isPlaying)}>
                        <Ionicons name={isPlaying ? "pause" : 'play'} color="white" size={25} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity style={{}}>
                      <View style={{ backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>다음 ></Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{width: SCREEN_WIDTH, paddingHorizontal: 15}}>
                <ScrollView
                  horizontal
                >
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{backgroundColor: '#676666', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginRight: 5}}>
                      <Ionicons name={"md-pulse-sharp"} color="white" size={20} style={{marginBottom: 3,alignSelf: 'center'}}/>
                      <Text style={{color: 'white', fontSize: 10}}>이팩트</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#676666', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginRight: 5}}>
                      <Ionicons name={"md-pause-outline"} color="white" size={20} style={{marginBottom: 3,alignSelf: 'center'}}/>
                      <Text style={{color: 'white', fontSize: 10}}>브레이크</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#676666', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginRight: 5}}>
                      <Ionicons name={"speedometer-outline"} color="white" size={20} style={{marginBottom: 3,alignSelf: 'center'}}/>
                      <Text style={{color: 'white', fontSize: 10}}>싱크 조정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#676666', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginRight: 5}}>
                      <Ionicons name={"md-copy-outline"} color="white" size={20} style={{marginBottom: 3,alignSelf: 'center'}}/>
                      <Text style={{color: 'white', fontSize: 10}}>트랙 복제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#676666', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginRight: 5}}>
                      <Ionicons name={"trash-outline"} color="white" size={20} style={{marginBottom: 3,alignSelf: 'center'}}/>
                      <Text style={{color: 'white', fontSize: 10}}>트랙 삭제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#676666', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8, marginRight: 5}}>
                      <Ionicons name={"reload"} color="white" size={20} style={{marginBottom: 3,alignSelf: 'center'}}/>
                      <Text style={{color: 'white', fontSize: 10}}>초기화</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
                </View>
            </View>
          )}
        </>
      ) : ( // 선택된 비디오가 없다면
        <Pressable
          style={styles.buttonContainer}
          onPress={handlePressSelectVideoButton}>
          <Text style={styles.buttonText}>Select a video</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  buttonContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    color: 'blacks',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: 0.5 * SCREEN_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 0,
  },
  video: {
    height: '100%',
    width: '100%',
  },
  durationWindowAndFramesLineContainer: {
    width: SCREEN_WIDTH,
    zIndex: 10,
    backgroundColor: 'black'
  },
  popLineContainer: {
    position: 'absolute',
    alignSelf: POPLINE_POSITION === '50%' && 'center',
    zIndex: 25,
    left: FRAME_WIDTH * 3 + 10
  },
  popLine: {
    width: 3,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: 'yellow',
  },
  framesLine: {
    width: SCREEN_WIDTH,
  },
  loadingFrame: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
});

export default Camera;
