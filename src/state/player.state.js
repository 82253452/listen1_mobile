import {createContainer} from 'unstated-next';
import createPersistedState from '../utils/use-persisted-state/src';
import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';

const usePlayTrack = createPersistedState('nowplayingTrack', AsyncStorage);
const usePlayTracks = createPersistedState('tracks', AsyncStorage);

const ENUM_PLAYMODE = Object.freeze({
  LOOP: 0, //顺序
  SHUFFLE: 1, //随机
  REPEAT_ONE: 2, //单曲
});

function UsePlayState() {
  //当前播放
  const [nowplayingTrack, setNowplayingTrack] = usePlayTrack({
    title: 'Listen1',
    artist: 'artist',
  });
  //当前播放列表
  const [tracks, setTracks] = usePlayTracks([]);
  //播放模式
  const [playMode, setPlayMode] = useState(ENUM_PLAYMODE.LOOP);
  //时长
  const [duration, setDuration] = useState(0);
  //当前播放进度
  const [current, setCurrent] = useState(0);
  //播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  //快进
  const [seek, setSeek] = useState(0);

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  function changePlayMode() {
    const newPlayMode = (playMode + 1) % Object.keys(ENUM_PLAYMODE).length;
    setPlayMode(newPlayMode);
  }

  /**
   * 上一曲
   */
  function prevTrack() {
    isPlaying || setIsPlaying(true);
    if (nowplayingTrack.id === tracks[0].id) {
      return;
    }
    let index;
    //随机播放
    if (playMode === ENUM_PLAYMODE.SHUFFLE) {
      index = Math.floor(Math.random() * (tracks.length + 1));
    } else {
      index = tracks.findIndex((t) => t.id === nowplayingTrack.id) - 1;
    }
    setNowplayingTrack(tracks[index]);
  }

  /**
   * 下一曲
   */
  function nextTrack() {
    isPlaying || setIsPlaying(true);
    //最后一曲
    if (nowplayingTrack.id === tracks[tracks.length - 1].id) {
      setNowplayingTrack(tracks[0]);
      return;
    }
    let index;
    //随机播放
    if (playMode === ENUM_PLAYMODE.SHUFFLE) {
      index = Math.floor(Math.random() * (tracks.length + 1));
    } else {
      index = tracks.findIndex((t) => t.id === nowplayingTrack.id) + 1;
    }
    setNowplayingTrack(tracks[index]);
  }
  function pause() {
    setIsPlaying(false);
  }
  function play() {
    setIsPlaying(true);
  }

  function loadFail() {
    pause();
  }

  /**
   * 播放全部
   * @param tracks
   */
  function playTracks(tracks) {
    setTracks(tracks);
    isPlaying || setIsPlaying(true);
    setNowplayingTrack(tracks[0]);
  }

  /**
   * 播放表单单曲
   * @param track
   */
  function playTrack(track) {
    const index = tracks.findIndex((t) => t.id === track.id);
    if (index === -1) {
      setTracks([...tracks, track]);
      setNowplayingTrack(track);
    } else {
      setNowplayingTrack(tracks[index]);
    }
  }

  /**
   * 播放新列表
   * @param track
   * @param newTracks
   */
  function playNewTrack({track, tracks: newTracks}) {
    setTracks(newTracks);
    setNowplayingTrack(track);
  }
  function removeTrack(payload) {}

  return {
    seek,
    setSeek,
    playMode,
    current,
    setCurrent,
    duration,
    setDuration,
    nowplayingTrack,
    isPlaying,
    tracks,
    togglePlay,
    playNewTrack,
    changePlayMode,
    prevTrack,
    nextTrack,
    pause,
    play,
    loadFail,
    playTracks,
    removeTrack,
    playTrack,
  };
}

export default createContainer(UsePlayState);
