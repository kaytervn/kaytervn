import { ToastContainer } from "react-toastify";

const MyToastContainer = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={true}
      pauseOnHover={false}
      theme="colored"
      style={{
        width: "auto",
        maxWidth: "90vw",
        margin: "0 auto",
        fontSize: "14px",
      }}
      toastStyle={{
        borderRadius: "8px",
        padding: "10px",
        minHeight: "50px",
      }}
      className="custom-toast-container"
    />
  );
};

export default MyToastContainer;
