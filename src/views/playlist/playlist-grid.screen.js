import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import styled, {withTheme} from 'styled-components';
import Client from '../../api/client';
import {playlistSetting} from '../../config/settings';
import {FlatGrid} from 'react-native-super-grid';
import CardView from 'react-native-cardview';
import {TouchableOpacity} from 'react-native-gesture-handler';
const SongTitle = styled.Text`
  font-size: ${playlistSetting.briefTitleFontSize};
  margin-top: 5px;
  height: 50px;
  width: 100px;
  text-align: center;
  font-weight: bold;
  font-family: Roboto;
  color: ${(props) => props.theme.secondaryColor};
`;
const SongImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 10;
`;

function PlaylistGrids({theme, navigation, platformId}) {
  const [result, setResult] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    function requestData() {
      setRefreshing(true);
      Client.showPlaylist(page, platformId).then(
        ({result: r, hasNextPage = false}) => {
          setRefreshing(false);
          setHasNextPage(hasNextPage);
          if (page === 0) {
            setResult(r);
          } else {
            setResult([...result, ...r]);
          }
        },
      );
    }
    requestData(page);
  }, [page]);

  function handleLoadMore() {
    hasNextPage && setPage(page + 1);
  }

  return (
    <FlatGrid
      itemDimension={100}
      data={result}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      onRefresh={() => {
        setPage(1);
      }}
      style={{
        backgroundColor: theme.backgroundColor,
      }}
      ListHeaderComponent={() => (
        <View
          style={{
            height: Platform.OS === 'android' ? 10 : 0,
            backgroundColor: theme.backgroundColor,
          }}
        />
      )}
      onEndReachedThreshold={0.4}
      onEndReached={handleLoadMore}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('Details', {
                item: {info: item},
              });
            }}>
            <View style={{alignItems: 'center'}}>
              <CardView
                cardElevation={10}
                cardMaxElevation={20}
                cornerRadius={10}>
                <SongImage
                  source={{uri: item.cover_img_url}}
                  resizeMode="cover"
                />
              </CardView>
              <SongTitle>{item.title}</SongTitle>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

export default withTheme(PlaylistGrids);
