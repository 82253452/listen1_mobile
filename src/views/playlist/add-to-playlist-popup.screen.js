import React from 'react';
import {FlatList, View} from 'react-native';
import {withTheme} from 'styled-components';
import {CloseTouchable, PlaylistRow, PrimaryText} from '../../components';
import PlayListContainer from '../../state/playList.state';

function AddToPlaylistPopup({myPlaylistState, onClose, onPress, item}) {
  const {playList} = PlayListContainer.useContainer();

  const onPressItem = (item) => {
    onPress({
      track: item,
      playlist: item,
    });
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={playList}
        renderItem={({item}) => (
          <PlaylistRow onPress={onPressItem} item={item} />
        )}
      />
      <CloseTouchable onPress={onClose}>
        <PrimaryText>关闭</PrimaryText>
      </CloseTouchable>
    </View>
  );
}

export default withTheme(AddToPlaylistPopup);
