import React, {useRef} from 'react';
import {withTheme} from 'styled-components';
import {ModalLite} from '../../components';
import PlaylistPopup from '../playlist/playlist-popup.screen';
import {showToast} from '../../modules/toast';
import ModalContainer from '../../../src/state/modal.state';
import PlayerContainer from '../../state/player.state';

function ModalLiteContainer({theme}) {
  const playlistPopupRef = useRef(null);
  const {liteOpen, closeModalLite} = ModalContainer.useContainer();

  const {
    tracks,
    nowplayingTrack,
    playTrack,
    removeTrack,
  } = PlayerContainer.useContainer();

  function onOpened() {
    playlistPopupRef.current.scrollToCurrent();
  }
  const onPressItem = (item) => {
    if (item.disabled) {
      return showToast('平台版权原因无法播放，请尝试其它平台');
    }

    playTrack(item);
    closeModalLite();
  };
  const onPressRemoveItem = (item) => {
    removeTrack(item);
  };

  return (
    <ModalLite
      isVisible={liteOpen}
      duration={200}
      modalHeight={500}
      backgroundColor={theme.windowColor}
      onClose={closeModalLite}
      onOpened={onOpened}>
      <PlaylistPopup
        ref={playlistPopupRef}
        tracks={tracks}
        onPressItem={onPressItem}
        onClose={closeModalLite}
        onPressRemoveItem={onPressRemoveItem}
        nowPlayingTrackId={nowplayingTrack === null ? '' : nowplayingTrack.id}
      />
    </ModalLite>
  );
}

export default withTheme(ModalLiteContainer);
