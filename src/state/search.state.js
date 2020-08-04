import {createContainer} from 'unstated-next';
import {useState} from 'react';

function UsePlayState() {
  const [searchText, setSearchText] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  return {currentTab, searchText, setSearchText, setCurrentTab};
}

export default createContainer(UsePlayState);
