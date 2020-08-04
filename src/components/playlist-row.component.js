import React from 'react';
import {TouchableHighlight} from 'react-native';
import styled from 'styled-components';
import {ColumnFlex, RowFlex} from './flex.component';
import {PrimaryText} from './text.component';
import {AImage} from './image.component';

const MyPlaylistRow = styled(RowFlex)`
  height: 65;
  align-items: center;
  padding: 0 10px;
  background-color: #fff;
`;
const MyPlaylistCover = styled(AImage)`
  width: 50px;
  height: 50px;
  margin: 0 10px 0 5px;
  border-radius: 5px;
`;
const MyPlaylistTitle = styled(PrimaryText)`
  margin-bottom: 5px;
  font-family: Roboto;
  font-weight: bold;
  color: #5a5a5a;
`;

export function PlaylistRow({item, onPress}) {
  return (
    <TouchableHighlight onPress={() => onPress(item)}>
      <MyPlaylistRow>
        <MyPlaylistCover source={item.cover_img_url} />
        <ColumnFlex>
          <MyPlaylistTitle>{item.title}</MyPlaylistTitle>
        </ColumnFlex>
      </MyPlaylistRow>
    </TouchableHighlight>
  );
}
