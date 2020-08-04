import React from 'react';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';

import {withTheme} from 'styled-components';
import PlaylistGrid from './playlist-grid.screen';
import Search from './search.screen';
import Client from '../../api/client';
import {ThemeFlex} from '../../components';
import MyPlaylistList from '../myplaylist/myplaylist-list.screen';
import SearchContainer from '../../../src/state/search.state';

function PlaylistTab({theme, navigation}) {
  const {
    searchText,
    currentTab,
    setCurrentTab,
  } = SearchContainer.useContainer();

  function handleChangeTab({i}) {
    setCurrentTab(i);
  }
  function renderTabBar(props) {
    return (
      <DefaultTabBar
        {...props}
        style={{borderBottomWidth: 0}}
        textStyle={{fontFamily: 'Roboto'}}
      />
    );
  }
  return (
    <ThemeFlex>
      <ScrollableTabView
        initialPage={1}
        tabBarBackgroundColor={theme.windowColor}
        tabBarActiveTextColor={theme.textActiveColor}
        tabBarInactiveTextColor={theme.secondaryColor}
        style={searchText ? {display: 'none'} : {}}
        renderTabBar={renderTabBar}
        tabBarUnderlineStyle={{
          height: 0,
        }}>
        <MyPlaylistList
          style={{fontWeight: 'bold', fontFamily: 'Roboto'}}
          tabLabel="我的"
          key="my"
          platformId="my"
          navigation={navigation}
        />
        {Client.getPlatformArray().map((i) => {
          return (
            <PlaylistGrid
              tabLabel={i.name}
              key={i.platformId}
              platformId={i.platformId}
              navigation={navigation}
            />
          );
        })}
      </ScrollableTabView>

      <ScrollableTabView
        tabBarBackgroundColor={theme.windowColor}
        tabBarActiveTextColor={theme.textActiveColor}
        tabBarInactiveTextColor={theme.secondaryColor}
        style={searchText ? {} : {display: 'none'}}
        onChangeTab={handleChangeTab}
        renderTabBar={renderTabBar}
        tabBarUnderlineStyle={{
          height: 0,
        }}>
        {Client.getPlatformArray().map((i, index) => {
          return (
            <Search
              tabLabel={i.name}
              key={i.platformId}
              tabIndex={index}
              platformId={i.platformId}
              navigation={navigation}
              getIndex={currentTab}
            />
          );
        })}
      </ScrollableTabView>
    </ThemeFlex>
  );
}

export default withTheme(PlaylistTab);
