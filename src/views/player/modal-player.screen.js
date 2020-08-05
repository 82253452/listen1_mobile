import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import styled, {withTheme} from 'styled-components';
import Slider from 'react-native-slider';
import ModalLiteContainer from './modal-lite-container.screen';
import PlayerControl from './player-control.screen';
import PlayerInfo from './player-info.screen';

import {colors} from '../../config/colors';
import {AImage} from '../../components';

import {modalPlayerSetting} from '../../config/settings';
import PlayerContainer from '../../state/player.state';
import ModalContainer from '../../state/modal.state';
import PlayListContainer from '../../state/playList.state';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import CardView from 'react-native-cardview';

const ModalPlayer = styled.View`
  flex: 1 0;
  align-items: center;
  background: ${(props) => props.theme.windowColor};
  padding-top: ${modalPlayerSetting.paddingTop + 20};
  padding-bottom: ${modalPlayerSetting.paddingBottom};
`;

const ModalSongCover = styled(AImage)`
  width: 300;
  height: 300;
  border-radius: 20;
`;

const ModalSongTime = styled.Text`
  width: 50;
  flex: 0 50px;
  text-align: center;
  color: ${(props) => props.theme.secondaryColor};
`;

const transTime = (time) => {
  const minute = Math.floor(time / 60);
  const second = Math.floor(time % 60);

  return `${minute > 10 ? minute : `0${minute}`}:${
    second > 9 ? second : `0${second}`
  }`;
};

const styles = StyleSheet.create({
  sliderBtn: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#D43C33',
    borderColor: '#000',
    borderWidth: 7,
    borderRadius: 10,
  },
});

function ModalPlayerViwe() {
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const {
    setSeek,
    duration,
    isPlaying,
    togglePlay,
    playMode,
    nowplayingTrack,
    changePlayMode,
    prevTrack,
    nextTrack,
    current,
  } = PlayerContainer.useContainer();
  const {openModelLite} = ModalContainer.useContainer();
  const {
    favoriteList,
    addToMyFavorite,
    removeFromMyFavorite,
  } = PlayListContainer.useContainer();

  useUpdateEffect(() => {
    if (current) {
      const progress = current / duration;
      if (!isSeeking) {
        setProgress(progress);
      }
    } else {
      setProgress(0);
    }
  }, [current]);

  function sliderChange(value) {
    setProgress(value);
    const currentTime = duration * value;
    setSeek(currentTime);
  }

  function getFavStatus() {
    return favoriteList.some((t) => t.id === nowplayingTrack.id);
  }

  function onControlPlaylist() {
    openModelLite({height: 500, type: 'nowplaying'});
  }
  function onFav() {
    getFavStatus()
      ? removeFromMyFavorite(nowplayingTrack)
      : addToMyFavorite(nowplayingTrack);
  }
  return (
    <ModalPlayer>
      <CardView cardElevation={20} cardMaxElevation={40} cornerRadius={20}>
        <ModalSongCover
          source={
            !nowplayingTrack
              ? './assets/images/logo.png'
              : nowplayingTrack.img_url
          }
        />
      </CardView>
      <PlayerInfo nowplayingTrack={nowplayingTrack} />
      <View style={styles.sliderBtn}>
        <ModalSongTime>{transTime(current)}</ModalSongTime>
        <Slider
          maximumTrackTintColor={colors.black}
          minimumTrackTintColor={colors.theme}
          thumbStyle={styles.thumb}
          trackStyle={{height: 2}}
          style={{flex: 1}}
          value={progress}
          onSlidingStart={() => {
            setIsSeeking(true);
          }}
          onSlidingComplete={(value) => {
            sliderChange(value);
          }}
        />
        <ModalSongTime>{transTime(duration)}</ModalSongTime>
      </View>

      <PlayerControl
        isPlaying={isPlaying}
        playMode={playMode}
        onPlayMode={changePlayMode}
        onPrev={prevTrack}
        onPlay={togglePlay}
        onNext={nextTrack}
        onPlaylist={onControlPlaylist}
      />

      <ModalLiteContainer />
    </ModalPlayer>
  );
}

export default withTheme(ModalPlayerViwe);
