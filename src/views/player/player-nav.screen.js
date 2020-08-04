import React from 'react';
import {View} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import styled, {withTheme} from 'styled-components';

import {RowFlex} from '../../components';

const ModalNavbar = styled.View`
  height: 60;
  height: 60;
  width: 100%;
  flex: 0 60px;
  margin-bottom: 10;
`;
const ModalBackButton = styled.TouchableOpacity`
  width: 60;
  height: 60;
  flex: 0 60px;
  align-items: center;
  justify-content: center;
`;
const ModalMoreButton = styled.TouchableOpacity`
  width: 60;
  height: 60;
  flex: 0 60px;
  align-items: center;
  justify-content: center;
`;
function PlayerNav({theme, onBack, onMore}) {
  return (
    <ModalNavbar>
      <RowFlex>
        {/*<ModalBackButton onPress={onBack}>*/}
        {/*  <Icon name="navigate-before" size={20} color={theme.secondaryColor} />*/}
        {/*</ModalBackButton>*/}
        <View style={{flex: 1}} />
        <ModalMoreButton onPress={onMore}>
          <Icon name="more-horiz" size={20} color={theme.secondaryColor} />
        </ModalMoreButton>
      </RowFlex>
    </ModalNavbar>
  );
}

export default withTheme(PlayerNav);
