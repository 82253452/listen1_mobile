import React from 'react';
import {FlatList} from 'react-native';
import styled, {withTheme} from 'styled-components';
import {Switch} from 'react-native-gesture-handler';
import {PrimaryText, RowFlex, TableCellRow, ThemeFlex} from '../../components';

import SettingContainer from '../../state/setting.state';

const SettingRow = styled(RowFlex)`
  height: 60px;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderColor};
`;

const KeyField = styled(PrimaryText)`
  text-align: left;
`;

function Setting({theme, navigation}) {
  const {settingState, changeTheme} = SettingContainer.useContainer();

  function onChangeTheme(newValue) {
    let nextTheme = 'black';

    if (newValue) {
      nextTheme = 'black';
    } else {
      nextTheme = 'white';
    }
    changeTheme(nextTheme);
  }
  function onPressAbout() {
    navigation.navigate('About');
  }
  function onPressBackup() {
    navigation.navigate('ExportLocal');
  }
  function onPressRestore() {
    navigation.navigate('ImportLocal');
  }
  return (
    <ThemeFlex>
      <FlatList
        keyExtractor={(item) => item.toString()}
        data={[1, 2, 3, 4]}
        renderItem={(item) => {
          if (item.index === 0) {
            return (
              <SettingRow>
                <KeyField>夜间模式</KeyField>
                <Switch
                  value={settingState.theme === 'black'}
                  onValueChange={onChangeTheme}
                />
              </SettingRow>
            );
          } else if (item.index === 1) {
            return <TableCellRow onPress={onPressBackup} title="备份" />;
          } else if (item.index === 2) {
            return <TableCellRow onPress={onPressRestore} title="恢复" />;
          } else if (item.index === 3) {
            return (
              <TableCellRow onPress={onPressAbout} title="关于 Listen 1" />
            );
          }

          return null;
        }}
      />
    </ThemeFlex>
  );
}

export default withTheme(Setting);
