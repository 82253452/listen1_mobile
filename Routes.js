import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider, withTheme} from 'styled-components';

import {blackTheme, whiteTheme} from './src/config/theme';

import {PrimaryText, ThemeFlex} from './src/components';
/* screens */
import PlaylistTabs from './src/views/playlist/playlist-tabs.screen';
import Playlist from './src/views/playlist/playlist.screen';
import Setting from './src/views/setting/setting.screen';
import CreatePlaylist from './src/views/myplaylist/create-playlist.screen';
import ImportPlaylist from './src/views/myplaylist/import-playlist.screen';
import BackgroundPlayer from './src/views/player/background-player.screen';
import MiniPlayer from './src/views/player/mini-player.screen';
import ModalPlayerContainer from './src/views/player/modal-player-container.screen';
import ModalLiteContainer from './src/views/player/modal-lite-container.screen';
import NavHeader from './src/views/playlist/nav-header.screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SettingContainer from './src/state/setting.state';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Test from './src/views/player/test.screen';

const Stack = createStackNavigator();

const ThemeAppContainer = withTheme(({theme}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          headerStyle: {elevation: 0},
          cardStyle: {backgroundColor: theme.windowColor},
        })}>
        <Stack.Screen
          name="Home"
          component={PlaylistTabs}
          options={({navigation, screenProps}) => ({
            headerTitle: () => (
              <NavHeader theme={theme} navigation={navigation} />
            ),
            headerStyle: {
              backgroundColor: theme.windowColor,
              elevation: 0,
            },
          })}
        />
        <Stack.Screen
          name="Details"
          component={Playlist}
          options={({navigation, screenProps}) => ({screenProps}) => ({
            headerTintColor: theme.primaryColor,
            headerStyle: {backgroundColor: theme.windowColor},
          })}
        />
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={({screenProps}) => {
            return {
              title: '更多',
              headerTintColor: theme.primaryColor,
              headerStyle: {backgroundColor: theme.windowColor},
            };
          }}
        />
        <Stack.Screen
          name="CreatePlaylist"
          component={CreatePlaylist}
          options={({navigation, screenProps}) => {
            const {
              params = {
                onFinish: () => {},
              },
            } = navigation.state;

            return {
              title: '新建歌单',
              headerTintColor: theme.primaryColor,
              headerStyle: {backgroundColor: theme.windowColor},
              headerRight: (
                <TouchableOpacity
                  onPress={() => params.onFinish()}
                  style={{padding: 10}}>
                  <PrimaryText style={{fontSize: 18}}>完成</PrimaryText>
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Stack.Screen
          name="ImportPlaylist"
          component={ImportPlaylist}
          options={({navigation, screenProps}) => {
            const {
              params = {
                onFinish: () => {},
              },
            } = navigation.state;

            return {
              title: '导入歌单',
              headerTintColor: theme.primaryColor,
              headerStyle: {backgroundColor: theme.windowColor},
              headerRight: (
                <TouchableOpacity
                  onPress={() => params.onFinish()}
                  style={{padding: 10}}>
                  <PrimaryText style={{fontSize: 18}}>打开</PrimaryText>
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Stack.Screen
          name="About"
          component={PlaylistTabs}
          options={({screenProps}) => {
            return {
              title: '关于',
              headerTintColor: theme.primaryColor,
              headerStyle: {backgroundColor: theme.windowColor},
            };
          }}
        />
        <Stack.Screen
          name="Test"
          component={Test}
          options={({screenProps}) => {
            return {
              title: 'Test',
              headerTintColor: theme.primaryColor,
              headerStyle: {backgroundColor: theme.windowColor},
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

const ThemeStatusBar = withTheme(({theme}) => {
  return (
    <StatusBar backgroundColor={theme.windowColor} barStyle={theme.barStyle} />
  );
});
export default function App() {
  const {settingState} = SettingContainer.useContainer();
  return (
    <ThemeProvider
      theme={settingState.theme === 'black' ? blackTheme : whiteTheme}>
      <ThemeFlex>
        <ThemeAppContainer />
        <ThemeStatusBar />
        <BackgroundPlayer />
        <MiniPlayer />
        <ModalPlayerContainer />
        <ModalLiteContainer />
      </ThemeFlex>
    </ThemeProvider>
  );
}
