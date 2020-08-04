import React, {useRef, useState} from 'react';
import {Platform, Text, View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import styled, {withTheme} from 'styled-components';
import SearchContainer from '../../state/search.state';
import PlayListContainer from '../../state/playList.state';

const ModalBackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  flex: 0 40px;
  align-items: center;
  justify-content: center;
`;
const SettingButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  flex: 0 40px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;
function NavHeaders({navigation, theme}) {
  const input = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const {setSearchText: search} = SearchContainer.useContainer();

  const onFocus = () => {
    setIsFocus(true);
  };
  const onSubmit = (event) => {
    search(event.nativeEvent.text);
  };
  const onBack = () => {
    setIsFocus(false);
    setSearchText('');
    search('');
    input.current.blur();
  };
  const onSetting = async () => {
    navigation.navigate('Setting');
  };
  const updateSearch = (searchText) => {
    setSearchText(searchText);
  };
  function searchFocus() {
    setIsFocus(true);
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      {!isFocus ? (
        <Text
          onPress={async () => {
            navigation.navigate('Test');
          }}
          style={{
            flex: 0,
            flexBasis: 100,
            fontSize: 24,
            textAlign: 'center',
            color: theme.primaryColor,
            paddingLeft: 10,
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}>
          Listen1
        </Text>
      ) : (
        <ModalBackButton onPress={onBack}>
          <Icon name="arrow-back" size={25} color={theme.primaryColor} />
        </ModalBackButton>
      )}
      {isFocus && (
        <View style={{flex: 1}}>
          <SearchBar
            lightTheme
            platform={Platform.OS === 'ios' ? 'ios' : 'default'}
            inputContainerStyle={{backgroundColor: theme.windowColor}}
            containerStyle={
              Platform.OS === 'ios'
                ? {
                    backgroundColor: theme.windowColor,
                    height: 26,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                  }
                : {
                    backgroundColor: theme.windowColor,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                  }
            }
            value={searchText}
            inputStyle={{fontSize: 14}}
            onChangeText={updateSearch}
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            onFocus={onFocus}
            ref={input}
            autoFocus
            clearIcon={searchText !== '' ? {name: 'cancel'} : false}
            placeholder="输入歌曲名，歌手或专辑"
          />
        </View>
      )}
      {isFocus || (
        <SettingButton onPress={searchFocus}>
          <IconI name="search-circle" size={30} color={theme.primaryColor} />
        </SettingButton>
      )}
      {/*{!isFocus ? (*/}
      {/*  <SettingButton onPress={onSetting}>*/}
      {/*    <Icon name="menu" size={30} color={theme.secondaryColor} />*/}
      {/*  </SettingButton>*/}
      {/*) : null}*/}
    </View>
  );
}
export default withTheme(NavHeaders);
