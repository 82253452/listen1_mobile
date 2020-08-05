import React from 'react';
import {Pressable} from 'react-native';
import styled, {withTheme} from 'styled-components';
import PlayerContainer from '../../../src/state/player.state';
import ModalContainer from '../../../src/state/modal.state';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import {ColumnFlex, RowFlex} from '../../components';
import {miniPlayerSetting} from '../../config/settings';

const MiniBar = styled.View`
  width: 100%;
  height: ${({moveHeight}) => moveHeight}};
  paddingBottom: ${miniPlayerSetting.paddingBottom}};
  background-color: ${(props) => props.theme.miniBarColor};
  border-top-left-radius: 50;
  border-top-right-radius: 50;
`;
const SongLogo = styled.Image`
  width: 50px;
  height: 50px;
  flex: 0 50px;
  margin-left: 10px;
  border-radius: 20;
  margin-top: 10;
`;
const SongInfo = styled(ColumnFlex)`
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 20px;
  margin-top: 20px;
`;
const SongTitle = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 3px;
  font-weight: bold;
  color: ${(props) => props.theme.windowColor};
`;
const ArtistTitle = styled.Text`
  font-size: ${miniPlayerSetting.subtitleFontSize};
  text-align: center;
  color: ${(props) => props.theme.secondaryColor};
`;
const PlayButton = styled.TouchableOpacity`
  width: 100px;
  height: ${miniPlayerSetting.height};
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;
const PlayButtonView = styled.TouchableOpacity`
  width: 30px;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
function MainPlayer({theme, navigation}) {
  const initHeight = miniPlayerSetting.height + miniPlayerSetting.paddingBottom;
  const {
    nowplayingTrack,
    isPlaying,
    nextTrack,
    prevTrack,
    togglePlay,
  } = PlayerContainer.useContainer();
  const {openModal} = ModalContainer.useContainer();

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderGrant: () => {
  //       console.log('grant');
  //       openModal();
  //     },
  //     onPanResponderMove: (event, state) => {
  //       changeOpacity(-state.dy / 500);
  //     },
  //     onPanResponderRelease: (event, state) => {
  //       console.log('relaease');
  //       if (-state.dy > deviceHeight / 3) {
  //         changeOpacity(1);
  //       } else {
  //         changeOpacity(0);
  //       }
  //     },
  //     onPanResponderTerminate: () => {
  //       console.log('terminate');
  //       // setViewOpacity(1);
  //       // setViewHeight(initHeight);
  //     },
  //     //被强制放权
  //     onResponderReject: () => {
  //       console.log('reject');
  //     },
  //     //有其他应用夺权是否放权
  //     onResponderTerminationRequest: () => false,
  //   }),
  // ).current;
  // function test() {
  //   console.log('');
  // }
  function toPlayer() {
    navigation.navigate('Player');
  }
  return (
    <Pressable
      onPress={toPlayer}
      style={{
        width: '100%',
        height: initHeight,
        backgroundColor: theme.miniBarColor,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}>
      <RowFlex>
        <IconF
          name="bar-chart-2"
          style={{
            color: theme.windowColor,
            fontSize: 20,
            marginLeft: 20,
            marginTop: 25,
          }}
        />
        <SongLogo
          source={
            !nowplayingTrack
              ? require('../../assets/images/logo.png')
              : {uri: nowplayingTrack.img_url}
          }
        />
        <SongInfo>
          <SongTitle>{nowplayingTrack.title}</SongTitle>
          <ArtistTitle>{nowplayingTrack.artist}</ArtistTitle>
        </SongInfo>

        <PlayButton>
          <PlayButtonView style={{marginRight: 20}} onPress={prevTrack}>
            <IconC name={'skip-previous'} size={30} color={theme.windowColor} />
          </PlayButtonView>
          <PlayButtonView onPress={togglePlay}>
            <Icon
              name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
              size={30}
              color={theme.windowColor}
            />
          </PlayButtonView>
          <PlayButtonView style={{marginLeft: 20}} onPress={nextTrack}>
            <IconC name={'skip-next'} size={30} color={theme.windowColor} />
          </PlayButtonView>
        </PlayButton>
      </RowFlex>
    </Pressable>
  );
}

export default withTheme(MainPlayer);
