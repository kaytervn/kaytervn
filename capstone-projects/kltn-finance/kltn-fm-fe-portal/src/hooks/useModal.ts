import { useState } from "react";

const useModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formConfig, setFormConfig] = useState<any>({});

  const showModal = (config: any) => {
    setFormConfig(config);
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
