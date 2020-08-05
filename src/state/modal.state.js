import {createContainer} from 'unstated-next';
import {useState} from 'react';

function Container() {
  const [modalOpen, setModalOpen] = useState(false);
  const [liteOpen, setLiteOpen] = useState(false);

  function toggleModal() {
    setModalOpen(!modalOpen);
  }
  function openModal() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }
  function openModelLite(payload) {
    setLiteOpen(true);
  }
  function closeModalLite() {
    setLiteOpen(false);
  }

  return {
    modalOpen,
    liteOpen,
    openModal,
    closeModal,
    toggleModal,
    openModelLite,
    closeModalLite,
  };
}

export default createContainer(Container);
