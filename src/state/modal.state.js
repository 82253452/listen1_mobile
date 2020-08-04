import {createContainer} from 'unstated-next';
import {useState} from 'react';

function Container() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    opacity: 0,
    isLiteOpen: false,
    liteHeight: 500,
    liteType: '',
    item: {},
  });
  function toggleModal() {
    setModalState({...modalState, isOpen: !modalState.isOpen});
  }
  function openModal() {
    setModalState({...modalState, isOpen: true});
  }
  function closeModal() {
    setModalState({...modalState, isOpen: false});
  }
  function openModelLite(payload) {
    setModalState({
      ...modalState,
      isLiteOpen: true,
      liteHeight: payload.height || 500,
      liteType: payload.type || '',
      item: payload.item || {},
    });
  }
  function closeModalLite() {
    setModalState({
      ...modalState,
      isLiteOpen: false,
    });
  }
  function changeOpacity(v) {
    setModalState({
      ...modalState,
      opacity: v,
      isOpen: v > 0,
    });
  }
  return {
    modalState,
    openModal,
    closeModal,
    toggleModal,
    openModelLite,
    changeOpacity,
    closeModalLite,
  };
}

export default createContainer(Container);
