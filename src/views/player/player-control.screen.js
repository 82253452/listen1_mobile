import React, {useEffect} from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import styled, {withTheme} from 'styled-components';

import {RowFlex} from '../../components';

const PlayControlRow = styled(RowFlex)`
  align-items: center;
  flex: 0 180px;
`;
const ControlButton = styled.TouchableOpacity`
  width: 70px;
  height: 70;
  flex: 0 70px;
  align-items: center;
  justify-content: center;
`;
const PlayButton = styled(ControlButton)`
  width: 80;
  height: 80;
  flex: 0 80px;
`;

function PlayerControl({
  isPlaying,
  playMode,
  onPlayMode,
  onPrev,
  onPlay,
  onNext,
  onPlaylist,
  theme,
}) {
  return (
    <PlayControlRow>
      <ControlButton onPress={onPlayMode}>
        <Icon
          name={{0: 'repeat', 1: 'shuffle', 2: 'repeat-one'}[playMode] || ''}
          size={30}
          color={theme.primaryColor}
        />
      </ControlButton>
      <ControlButton onPress={onPrev}>
        <IconI name="play-skip-back" size={30} color={theme.primaryColor} />
      </ControlButton>
      <PlayButton onPress={onPlay}>
        <IconI
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={50}
          color={theme.primaryColor}
        />
      </PlayButton>
      <ControlButton onPress={onNext}>
        <IconI name="play-skip-forward" size={30} color={theme.primaryColor} />
      </ControlButton>
      <ControlButton onPress={onPlaylist} title="Playlist">
        <IconI name="options" size={30} color={theme.primaryColor} />
      </ControlButton>
    </PlayControlRow>
  );
}

export default withTheme(PlayerControl);
