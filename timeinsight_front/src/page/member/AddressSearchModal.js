import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";

const AddressSearchModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleComplete = (data) => {
    // 주소 처리 로직
    handleCloseModal();
  };

  return (
    <div>
      <button onClick={handleOpenModal}>주소 검색</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Address Search Modal"
      >
        <DaumPostcode onComplete={handleComplete} style={{ height: "400px" }} />
      </Modal>
    </div>
  );
};

export default AddressSearchModal;
