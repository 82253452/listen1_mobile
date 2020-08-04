import React, {useRef} from 'react';
import {View} from 'react-native';
import {withTheme} from 'styled-components';
import {ModalLite} from '../../components';
import PlaylistPopup from '../playlist/playlist-popup.screen';
import TrackPopup from '../playlist/track-popup.screen';
import AddToPlaylistPopup from '../playlist/add-to-playlist-popup.screen';
import {showToast} from '../../modules/toast';
import ModalContainer from '../../../src/state/modal.state';
import PlayerContainer from '../../state/player.state';
import PlayListContainer from '../../state/playList.state';

function ModalLiteContainer({theme}) {
  const playlistPopupRef = useRef(null);
  const {
    modalState,
    openModalLite,
    closeModalLite,
  } = ModalContainer.useContainer();

  const {
    tracks,
    nowplayingTrack,
    addNextTrack,
    playTrack,
    removeTrack,
  } = PlayerContainer.useContainer();

  const {handleAddToMyPlaylist} = PlayListContainer.useContainer();

  function onPressTrackControl(option) {
    if (option.action.key === 'add_to_playlist') {
      openModalLite({
        height: 500,
        type: 'add_to_playlist',
        item: option.item,
      });
    } else if (option.action.key === 'next_to_play') {
      addNextTrack(option.item);
      closeModalLite();
      showToast('已加入下一首播放');
    }
  }
  function onPressAddToPlaylist(event) {
    handleAddToMyPlaylist(event);
    closeModalLite();
    showToast('添加歌单完成');
  }
  function onOpened() {
    if (modalState.liteType === 'nowplaying') {
      playlistPopupRef.current.scrollToCurrent();
    }
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
      isVisible={modalState.isLiteOpen}
      duration={200}
      modalHeight={modalState.liteHeight}
      backgroundColor={theme.windowColor}
      onClose={closeModalLite}
      onOpened={onOpened}>
      {modalState.liteType === '' ? <View style={{flex: 1}} /> : null}
      {modalState.liteType === 'nowplaying' ? (
        <PlaylistPopup
          ref={playlistPopupRef}
          tracks={tracks}
          onPressItem={onPressItem}
          onClose={closeModalLite}
          onPressRemoveItem={onPressRemoveItem}
          nowPlayingTrackId={nowplayingTrack === null ? '' : nowplayingTrack.id}
        />
      ) : null}

      {modalState.liteType === 'track' ? (
        <TrackPopup
          item={modalState.item}
          onClose={closeModalLite}
          onPress={onPressTrackControl}
        />
      ) : null}
      {modalState.liteType === 'add_to_playlist' ? (
        <AddToPlaylistPopup
          item={modalState.item}
          onClose={closeModalLite}
          onPress={onPressAddToPlaylist}
        />
      ) : null}
    </ModalLite>
  );
}

export default withTheme(ModalLiteContainer);
