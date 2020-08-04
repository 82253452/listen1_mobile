import React from 'react';
import {Pressable, View} from 'react-native';
import {withTheme} from 'styled-components';
import IconI from 'react-native-vector-icons/Ionicons';
import {
  AImage,
  ColumnFlex,
  PlaylistRow,
  PrimaryText,
  RowFlex,
  ThemeFlex,
} from '../../components';
import PlayListContainer from '../../state/playList.state';

import {SwipeListView} from 'react-native-swipe-list-view';

function MyPlaylistList({navigation, theme}) {
  const {playList, removePlayListByindex} = PlayListContainer.useContainer();

  const onPressItem = (item) => {
    navigation.navigate('Details', {
      item: {info: item},
    });
  };

  return (
    <ThemeFlex>
      <Pressable
        style={{height: 70, padding: 20}}
        onPress={() => onPressItem({})}>
        <RowFlex style={{alignItems: 'center'}}>
          <AImage
            style={{width: 50, height: 50, borderRadius: 5}}
            source="./assets/images/logo.png"
          />
          <PrimaryText
            style={{marginLeft: 10, fontFamily: 'Roboto', fontWeight: 'bold'}}>
            收藏
          </PrimaryText>
        </RowFlex>
      </Pressable>
      <SwipeListView
        leftOpenValue={70}
        disableLeftSwipe
        data={playList.map((d) => ({...d, key: d.id}))}
        renderHiddenItem={({index}) => (
          <View
            style={{
              width: 70,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconI
              style={{fontSize: 24}}
              name="ios-close-circle"
              onPress={() => removePlayListByindex(index)}
            />
          </View>
        )}
        renderItem={({item}) => (
          <PlaylistRow onPress={onPressItem} item={item} />
        )}
      />
    </ThemeFlex>
  );
}

export default withTheme(MyPlaylistList);
