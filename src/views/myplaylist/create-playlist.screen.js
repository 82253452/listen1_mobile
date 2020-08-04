import React, {useState} from 'react';
import {TextInput} from 'react-native';
import {withTheme} from 'styled-components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Flex, SecondaryText, ThemeFlex} from '../../components';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import PlayListContainer from '../../state/playList.state';

function CreatePlaylist({navigation, theme}) {
  const [text, setText] = useState('新建歌单');

  const {createMyPlaylist} = PlayListContainer.useContainer();

  useEffectOnce(() => {
    navigation.setParams({onFinish: onFinish});
  });

  function onFinish() {
    const playlist = {
      tracks: [],
      info: {
        title: this.state.text,
        id: '',
        cover_img_url: './assets/images/logo.png',
      },
    };
    createMyPlaylist(playlist);
    navigation.goBack();
  }

  function onPress() {
    navigation.replace('ImportPlaylist');
  }
  return (
    <ThemeFlex>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          color: theme.primaryColor,
        }}
        selectTextOnFocus
        autoFocus
        onChangeText={(text) => setText(text)}
        value={text}
      />
      <Flex style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            padding: 10,
            width: 150,
            marginTop: 50,
            alignItems: 'center',
          }}>
          <SecondaryText>导入外部歌单 &gt;</SecondaryText>
        </TouchableOpacity>
      </Flex>
    </ThemeFlex>
  );
}

export default withTheme(CreatePlaylist);
