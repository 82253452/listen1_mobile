import React, {useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Platform} from 'react-native';
import styled, {withTheme} from 'styled-components';
import Slider from 'react-native-slider';
import ModalLiteContainer from './modal-lite-container.screen';
import PlayerControl from './player-control.screen';
import PlayerInfo from './player-info.screen';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

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

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const {width: screenWidth} = Dimensions.get('window');

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    position: 'relative',
    top: -70,
    left: 40,
    fontSize: 30,
  },
  item: {
    width: itemWidth,
    height: itemWidth,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  sliderBtn: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
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
    tracks,
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
    playTrack,
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

  function carouselItem({item, index}, parallaxProps) {
    return (
      <View style={styles.item}>
        <ParallaxImage
          containerStyle={styles.imageContainer}
          style={styles.image}
          source={{uri: item.img_url}}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  }
  function indexChange(index) {
    playTrack(tracks[index]);
  }
  function getFirstIndex() {
    const index = tracks.findIndex((t) => nowplayingTrack.id === t.id);
    return index === -1 ? 0 : index;
  }
  return (
    <ModalPlayer>
      <Carousel
        firstItem={getFirstIndex()}
        onScrollIndexChanged={indexChange}
        data={tracks}
        renderItem={carouselItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        loop={true}
        hasParallaxImages={true}
      />
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
