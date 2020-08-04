import React from 'react';
import Modal from 'react-native-modal';
import ModalContainer from '../../../src/state/modal.state';

import {Dimensions} from 'react-native';

import ModalPlayer from './modal-player.screen';

export default function ModalPlayers() {
  const {modalState, toggleModal} = ModalContainer.useContainer();
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  return (
    <Modal
      isVisible={modalState.isOpen}
      onSwipeComplete={toggleModal}
      swipeDirection="down"
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      style={{margin: 0, opacity: 1}}
      propagateSwipe // allow pass swipe event to its children
      onBackButtonPress={toggleModal}>
      <ModalPlayer />
    </Modal>
  );
}
