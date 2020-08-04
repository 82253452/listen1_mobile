import {Text, View} from 'react-native';
import React, {useState} from 'react';
import {withTheme} from 'styled-components';
import {ListEditor} from '../../components';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import PlayListContainer from '../../state/playList.state';

function ReOrder({navigation, route}) {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState({});

  const {
    playListState,
    editMyPlaylist,
    saveMyPlaylists,
  } = PlayListContainer.useContainer();

  useEffectOnce(() => {
    if (route.params.type === 'myplaylist') {
      setData(playListState.playlists.slice(1));
    } else if (route.params.type === 'playlist') {
      const {info, tracks} = route.params.playlist;
      setData(tracks);
      setInfo(info);
    }
  });
  return (
    <View style={{flex: 1}}>
      <ListEditor
        renderRow={(d) => (
          <Text style={{flex: 1, marginLeft: 10}}>{d.title}</Text>
        )}
        data={data}
        ref={(component) => {
          this._listEditor = component;
        }}
        onChange={(data) => {
          // TODO: optimaze state sync frequency
          if (route.params.type === 'myplaylist') {
            saveMyPlaylists(data);
          } else if (route.params.type === 'playlist') {
            editMyPlaylist({tracks: data, info: info});
          }
        }}
      />
    </View>
  );
}

export default withTheme(ReOrder);
