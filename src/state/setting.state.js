import {createContainer} from 'unstated-next';
import {useState} from 'react';

function Container() {
  let [settingState, setSettingState] = useState({
    language: 'zh_CN',
    theme: 'white',
  });
  function changeTheme(theme) {
    setSettingState({...setSettingState, theme});
  }
  return {settingState, changeTheme};
}

export default createContainer(Container);
