import React, {useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import styled, {withTheme} from 'styled-components';
import IconI from 'react-native-vector-icons/Ionicons';
import LApi from '../../api/client';
import {AImage, ColumnFlex, Flex, RowFlex, TrackRow} from '../../components';
import {showToast} from '../../modules/toast';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import ModalContainer from '../../state/modal.state';
import PlayListContainer from '../../state/playList.state';
import PlayerContainer from '../../state/player.state';
import {SwipeListView} from 'react-native-swipe-list-view';

const PlaylistHeader = styled(View)`
  padding: 20px;
  height: 150px;
`;
const PlaylistHeaderCover = styled(AImage)`
  width: 120;
  height: 120;
  flex: 0 120px;
  border-radius: 10;
`;
const PlaylistHeaderTitle = styled.Text`
  flex: 1;
  margin-left: 10;
  color: ${(props) => props.theme.primaryColor};
  font-size: 16;
  font-family: Roboto;
  font-weight: bold;
`;
const ControlButton = styled.TouchableOpacity`
  width: 180;
  height: 40px;
  font-size: 26;
  flex-direction: row;
  align-items: center;
`;

function Playlists({theme, route, navigation}) {
  const [info, setInfo] = useState(route.params.item.info);
  const [tracks, setTracks] = useState([]);
  const [isMyPlaylist, setIsMyPlaylist] = useState(false);
  const {
    playList,
    favoriteList,
    handleAddToMyPlaylist,
    removeFromMyFavorite,
    addToMyFavorite,
  } = PlayListContainer.useContainer();
  const {
    nowplayingTrack,
    playTracks,
    playNewTrack,
  } = PlayerContainer.useContainer();

  const {openModelLite} = ModalContainer.useContainer();

  useEffectOnce(() => {
    if (info.id) {
      setIsMyPlaylist(playList.some((l) => l.id === info.id));

      LApi.getPlaylist(info.id).then((r) => {
        setTracks(r.tracks);
        info.cover_img_url || setInfo(r.info);
      });
    } else {
      //收藏界面
      setIsMyPlaylist(true);
      setTracks(favoriteList);
    }
  });

  useUpdateEffect(() => {
    setIsMyPlaylist(playList.some((l) => l.id === info.id));
  }, [playList]);

  function onPressRow(item) {
    if (item.disabled) {
      return showToast('平台版权原因无法播放，请尝试其它平台');
    }
    playNewTrack({track: item, tracks});
  }
  function popup(item) {
    openModelLite({height: 350, type: 'track', item});
  }
  function createPlayer() {
    handleAddToMyPlaylist(info);
    showToast('收藏成功');
  }
  return (
    <ColumnFlex>
      <PlaylistHeader>
        <RowFlex style={{alignItems: 'center'}}>
          <PlaylistHeaderCover
            source={info.cover_img_url || './assets/images/logo.png'}
          />
          <PlaylistHeaderTitle>{info.title || '收藏'}</PlaylistHeaderTitle>
        </RowFlex>
      </PlaylistHeader>
      <View style={{height: 50}}>
        <RowFlex style={{paddingLeft: 20, paddingRight: 20}}>
          <ControlButton style={{flex: 1}} onPress={() => playTracks(tracks)}>
            <IconI name="play-circle" size={26} color={theme.primaryColor} />
            <Text
              style={{
                marginLeft: 10,
                color: theme.primaryColor,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              播放全部
            </Text>
          </ControlButton>
          {isMyPlaylist || (
            <ControlButton
              style={{flex: 0, flexBasis: 100}}
              onPress={createPlayer}>
              <Text
                style={{
                  marginLeft: 10,
                  color: theme.primaryColor,
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                }}>
                收藏
              </Text>
            </ControlButton>
          )}
        </RowFlex>
      </View>
      <SwipeListView
        data={tracks.map((t) => ({...t, key: t.id}))}
        renderHiddenItem={({index}) => (
          <View
            style={{
              width: 70,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {favoriteList.some((t) => t.id === tracks[index].id) ? (
              <IconI
                style={{fontSize: 24}}
                name="ios-close-circle"
                onPress={() => removeFromMyFavorite(tracks[index])}
              />
            ) : (
              <IconI
                style={{fontSize: 24}}
                name="ios-heart"
                onPress={() => addToMyFavorite(tracks[index])}
              />
            )}
          </View>
        )}
        leftOpenValue={70}
        disableLeftSwipe
        renderItem={({item}) => {
          return (
            <TrackRow
              onPress={() => {
                onPressRow(item);
              }}
              item={item}
              onPressIcon={popup}
              iconType="more"
              isPlaying={item.id === nowplayingTrack.id}
            />
          );
        }}
      />
    </ColumnFlex>
  );
}

export default withTheme(Playlists);
