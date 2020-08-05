/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Routes from './Routes';
import PlayerContainerState from './src/state/player.state';
import ModalContainerState from './src/state/modal.state';
import PlayListContainer from './src/state/playList.state';
import SearchContainer from './src/state/search.state';
import SettingContainer from './src/state/setting.state';
import {RootSiblingParent} from 'react-native-root-siblings';

enableScreens();

const App: () => React$Node = () => {
  return (
    <RootSiblingParent>
      <PlayerContainerState.Provider>
        <ModalContainerState.Provider>
          <PlayListContainer.Provider>
            <SearchContainer.Provider>
              <SettingContainer.Provider>
                <Routes />
              </SettingContainer.Provider>
            </SearchContainer.Provider>
          </PlayListContainer.Provider>
        </ModalContainerState.Provider>
      </PlayerContainerState.Provider>
    </RootSiblingParent>
  );
};
//
// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.white,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

export default App;
