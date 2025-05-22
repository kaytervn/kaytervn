import { useState } from "react";

const useModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formConfig, setFormConfig] = useState({
    title: "Sample Title",
    color: "green",
    buttonText: "SAMPLE",
    onButtonClick: () => {},
    initForm: {},
  });

  const showModal = (config: any) => {
    setFormConfig({
      ...formConfig,
      ...config,
    });
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return {
    isModalVisible,
    showModal,
    hideModal,
    formConfig,
  };
};

export default useModal;
