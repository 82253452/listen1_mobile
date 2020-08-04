import React, {useState} from 'react';
import {TextInput} from 'react-native';
import {withTheme} from 'styled-components';
import {PrimaryText, ThemeFlex} from '../../components';
import Client from '../../api/client';
import useEffectOnce from 'react-use/lib/useEffectOnce';

function ImportPlaylist({navigation, theme}) {
  const [text, setText] = useState('');
  const [notice, setNotice] = useState('');
  useEffectOnce(() => {
    navigation.setParams({onFinish: onFinish});
  });

  function onFinish() {
    setNotice('');
    // get playlistid from client and push to playlist detail
    const result = Client.parseUrl(text);

    if (result === null) {
      setNotice('无法解析信息');
      return;
    }
    navigation.replace('Details', {
      item: {info: {id: result.id}},
    });
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
        placeholder="请粘贴歌单分享中复制链接的内容"
        selectTextOnFocus
        autoFocus
        onChangeText={(text) => setText(text)}
        value={text}
      />
      <PrimaryText>{notice}</PrimaryText>
    </ThemeFlex>
  );
}

export default withTheme(ImportPlaylist);
