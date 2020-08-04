import {createContainer} from 'unstated-next';
import AsyncStorage from '@react-native-community/async-storage';
import createPersistedState from '../utils/use-persisted-state/src';

const usePlayList = createPersistedState('playList', AsyncStorage);
const useFavoritePlayList = createPersistedState('favoriteList', AsyncStorage);

function UsePlayState() {
  const [playList, setPlayList] = usePlayList([]);
  const [favoriteList, setFavoriteList] = useFavoritePlayList([]);

  function addToMyFavorite(track) {
    setFavoriteList([...favoriteList, track]);
  }

  function handleAddToMyPlaylist(track) {
    setPlayList([...playList, track]);
  }

  function removePlayListByindex(index) {
    playList.splice(index, 1);
    setPlayList([...playList]);
  }

  function removeFromMyFavorite(track) {
    const index = favoriteList.findIndex((t) => t.id === track.id);
    if (index === -1) {
      return;
    }
    favoriteList.splice(index, 1);
    setFavoriteList([...favoriteList]);
  }

  return {
    playList,
    favoriteList,
    removeFromMyFavorite,
    removePlayListByindex,
    addToMyFavorite,
    handleAddToMyPlaylist,
  };
}

export default createContainer(UsePlayState);
