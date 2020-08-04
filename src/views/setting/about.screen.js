import React from 'react';
import {FlatList, Linking} from 'react-native';
import styled, {withTheme} from 'styled-components';

import {PrimaryText, RowFlex, TableCellRow, ThemeFlex} from '../../components';

import packageJson from '../../../package.json';

const SettingRow = styled(RowFlex)`
  height: 60px;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderColor};
`;
const Border = styled.View`
  flex: 0 1px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.borderColor};
`;
const KeyField = styled(PrimaryText)`
  text-align: left;
`;
const ValueField = styled(PrimaryText)`
  text-align: right;
`;
const LogoContainer = styled.View`
  flex: 0 200px;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 80;
  height: 80;
  flex: 0 80px;
`;

function About() {
  return (
    <ThemeFlex>
      <LogoContainer>
        <Logo source={require('../../assets/images/logo.png')} />
      </LogoContainer>
      <Border />
      <FlatList
        keyExtractor={(item) => item.toString()}
        data={[1, 2, 3]}
        renderItem={(item) => {
          if (item.index === 0) {
            return (
              <SettingRow>
                <KeyField> Listen 1 版本</KeyField>
                <ValueField>v{packageJson.version}</ValueField>
              </SettingRow>
            );
          } else if (item.index === 1) {
            return (
              <SettingRow>
                <KeyField> 开源协议</KeyField>
                <ValueField>MIT</ValueField>
              </SettingRow>
            );
          } else if (item.index === 2) {
            return (
              <TableCellRow
                onPress={() => {
                  Linking.openURL('https://listen1.github.io/listen1');
                }}
                title="检查更新"
              />
            );
          }

          return null;
        }}
      />
    </ThemeFlex>
  );
}

export default withTheme(About);
