import React, {useImperativeHandle, useRef} from 'react';
import {FlatList, View} from 'react-native';
import {CloseTouchable, PrimaryText, TrackRow} from '../../components';

function PlaylistPopup(props, ref) {
  const {
    tracks,
    onPressItem,
    onClose,
    onOpen,
    onPressRemoveItem,
    nowPlayingTrackId,
  } = props;
  const flatListRef = useRef();
  const getItemLayout = (data, index) => ({
    length: 50,
    offset: 50 * index,
    index,
  });
  useImperativeHandle(ref, () => ({
    scrollToCurrent: () => {
      scrollToCurrents();
    },
  }));
  const scrollToCurrents = () => {
    if (nowPlayingTrackId === '') {
      return;
    }
    const index = tracks.findIndex((item) => item.id === nowPlayingTrackId);

    if (index > -1) {
      const marginTopIndex = 4;
      let offsetIndex = index - marginTopIndex;

      if (offsetIndex < 0) {
        offsetIndex = 0;
      }
      flatListRef.current.scrollToIndex({animated: false, index: offsetIndex});
    }
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={tracks}
        ref={flatListRef}
        renderItem={({item}) => {
          return (
            <TrackRow
              onPress={() => onPressItem(item)}
              item={item}
              iconType="close"
              onPressIcon={onPressRemoveItem}
              isPlaying={item.id === nowPlayingTrackId}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        extraData={nowPlayingTrackId}
        onOpen={onOpen}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}

export default React.forwardRef(PlaylistPopup);
