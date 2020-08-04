import React from 'react';
import styled, {withTheme} from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Pressable} from 'react-native';

const PlaylistItem = styled.View`
  padding-left: 10;
  padding-right: 10;
  padding-top: 10;
  padding-bottom: 10;
  flex-direction: row;
  height: 50px;
`;
const PlaylistInfo = styled.View`
  flex-direction: column;
  flex: 1;
  margin-left: 10px;
`;

const PlaylistStatus = styled.TouchableOpacity`
  flex: 0 20px;
  align-items: center;
  justify-content: center;
`;

const PlaylistItemSongTitle = styled.Text`
  font-size: 14;
  color: ${(props) => props.theme.primaryColor};
  font-family: Roboto;
  font-weight: bold;
`;
const PlaylistItemSongInfo = styled.Text`
  font-size: 12;
  color: ${(props) => props.theme.secondaryColor};
  margin-top: 10px;
`;

function TrackRowClass({item, onPress, theme, isPlaying}) {
  const getStyle = () => {
    if (isPlaying) {
      return {color: theme.playingColor};
    }
    if (item.disabled) {
      return {color: theme.disableColor};
    }

    return {};
  };
  return (
    <Pressable
      style={{backgroundColor: theme.windowColor, width: '100%', height: 70}}
      onPress={onPress}>
      <PlaylistItem>
        {isPlaying && (
          <PlaylistStatus>
            <Icon name="volume-up" size={20} color={theme.playingColor} />
          </PlaylistStatus>
        )}
        <PlaylistInfo>
          <PlaylistItemSongTitle style={getStyle}>
            {item.title}
          </PlaylistItemSongTitle>
          <PlaylistItemSongInfo style={getStyle}>
            {item.artist} - {item.album}
          </PlaylistItemSongInfo>
        </PlaylistInfo>
      </PlaylistItem>
    </Pressable>
  );
}

export const TrackRow = withTheme(TrackRowClass);
