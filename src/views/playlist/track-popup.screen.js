import React from 'react';
import {FlatList, View} from 'react-native';
import {withTheme} from 'styled-components';
import {CloseTouchable, OptionRow, PrimaryText} from '../../components';

function TrackPopupClass({onClose, item, onPress}) {
  const controlArray = [
    {key: 'next_to_play', title: '下一首播放', icon: 'play-circle-outline'},
    {key: 'add_to_playlist', title: '收藏到歌单', icon: 'add-box'},
    {key: 'nav_artist', title: '歌手', icon: 'person'},
    {key: 'nav_album', title: '专辑', icon: 'album'},
    {key: 'nav_source', title: '来源', icon: 'insert-link'},
  ];
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={controlArray}
        ListHeaderComponent={() => (
          <View style={{padding: 15}}>
            <PrimaryText>{item.title}</PrimaryText>
          </View>
        )}
        renderItem={({item}) => {
          return <OptionRow onPress={onPress} option={item} item={item} />;
        }}
      />
      <CloseTouchable onPress={onClose}>
        <PrimaryText>关闭</PrimaryText>
      </CloseTouchable>
    </View>
  );
}
export default withTheme(TrackPopupClass);
