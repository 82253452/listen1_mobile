import React from 'react';
import Modal from 'react-native-modal';
import ModalContainer from '../../../src/state/modal.state';

import ModalPlayer from './modal-player.screen';

export default function ModalPlayers() {
  const {modalOpen, toggleModal} = ModalContainer.useContainer();

  return (
    <Modal
      isVisible={modalOpen}
      onSwipeComplete={toggleModal}
      swipeDirection="down"
      propagateSwipe
      animationInTiming={500}
      animationOutTiming={500}
      style={{
        margin: 0,
      }}
      backgroundTransitionOutTiming={0}
      onBackButtonPress={toggleModal}>
      <ModalPlayer />
    </Modal>
  );
}
