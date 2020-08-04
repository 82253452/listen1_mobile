import React, {useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import Client from '../../api/client';
import {ThemeFlex, TrackRow} from '../../components';
import {showToast} from '../../modules/toast';
import SearchContainer from '../../state/search.state';
import ModalContainer from '../../state/modal.state';
import PlayerContainer from '../../state/player.state';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

export default function Search({getIndex, tabIndex, platformId}) {
  const flatListRef = useRef();
  const [tracks, setTracks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);
  const {searchText, currentTab} = SearchContainer.useContainer();
  const {playTrack} = PlayerContainer.useContainer();
  const {openModelLite} = ModalContainer.useContainer();

  useUpdateEffect(() => {
    doSearch();
  }, [searchText, page]);

  useUpdateEffect(() => {
    tracks.length || doSearch();
  }, [currentTab]);

  const onRefresh = () => {};
  function doSearch() {
    if (!searchText) {
      return;
    }
    setIsRefreshing(true);
    Client.search(searchText, page, platformId).then((r) => {
      setIsRefreshing(false);
      setTracks(page === 1 ? r.result : [...tracks, ...r.result]);
      setTotal(r.total);
    });
  }
  const handleLoadMore = () => {
    if (onEndReachedCalledDuringMomentum) {
      return;
    }
    if (total && tracks.length >= total) {
      return;
    }
    setPage(page + 1);
  };
  const _keyExtractor = (item) => item.id;

  function onPlayTrack(item) {
    if (item.disabled) {
      return showToast('平台版权原因无法播放，请尝试其它平台');
    }

    return playTrack(item);
  }
  function popup(item) {
    openModelLite({height: 350, type: 'track', item});
  }

  return (
    <ThemeFlex>
      <FlatList
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        data={tracks}
        renderItem={({item}) => {
          return (
            <TrackRow
              onPress={() => {
                onPlayTrack(item);
              }}
              item={item}
              onPressIcon={popup}
              iconType="more"
            />
          );
        }}
        keyExtractor={_keyExtractor}
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
        onMomentumScrollBegin={() => {
          setOnEndReachedCalledDuringMomentum(false);
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </ThemeFlex>
  );
}
