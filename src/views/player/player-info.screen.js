import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled, {withTheme} from 'styled-components';

import {colors} from '../../config/colors';
import PlayListContainer from '../../state/playList.state';
import PlayerContainer from '../../state/player.state';

const ControlButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  margin-top: 20px;
`;

const ModalSongInfo = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
const Side = styled.View`
  flex: 0 60px;
`;
const Main = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 40px;
`;
const ModalSongTitle = styled.Text`
  font-size: 24;
  color: ${(props) => props.theme.primaryColor};
`;
const ModalSongArtist = styled.Text`
  font-size: 18;
  color: ${(props) => props.theme.secondaryColor};
`;

function PlayerInfo({theme}) {
  const {nowplayingTrack} = PlayerContainer.useContainer();
  const {
    favoriteList,
    addToMyFavorite,
    removeFromMyFavorite,
  } = PlayListContainer.useContainer();

  return (
    <ModalSongInfo>
      <Main>
        <ModalSongTitle>{nowplayingTrack.title}</ModalSongTitle>
        <ModalSongArtist>{nowplayingTrack.artist}</ModalSongArtist>
      </Main>
      <Side>
        {favoriteList.some((t) => t.id === nowplayingTrack.id) ? (
          <ControlButton
            onPress={() => {
              removeFromMyFavorite(nowplayingTrack);
            }}>
            <Icon name="favorite" size={30} color={colors.heartRed} />
          </ControlButton>
        ) : (
          <ControlButton
            onPress={() => {
              addToMyFavorite(nowplayingTrack);
            }}>
            <Icon
              name="favorite-border"
              size={30}
              color={theme.secondaryColor}
            />
          </ControlButton>
        )}
      </Side>
    </ModalSongInfo>
  );
}

export default withTheme(PlayerInfo);
