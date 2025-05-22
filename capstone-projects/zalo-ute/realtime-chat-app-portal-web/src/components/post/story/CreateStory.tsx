import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { remoteUrl } from "../../../types/constant";
import { useLoading } from "../../../hooks/useLoading";
import { uploadImage } from "../../../types/utils";
import { PlusCircle, Camera } from "lucide-react";

const CreateStory = ({ isVisible, setVisible, profile, onButtonClick }: any) => {
  const { showLoading, hideLoading } = useLoading();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false); // Để kiểm tra trạng thái camera
  const videoRef = useRef<HTMLVideoElement>(null); // Tham chiếu tới video element
  const canvasRef = useRef<HTMLCanvasElement>(null); // Tham chiếu tới canvas

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleCreateStory = async () => {
    if (!imageFile) {
      toast.error("Vui lòng chọn một hình ảnh");
      return;
    }

    try {
      showLoading();

      // Upload ảnh và lấy URL
      const imageUrl = await uploadImage(imageFile, async (url, formData) => {
        const response = await fetch(`${remoteUrl}${url}`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        return await response.json();
      });

      const response = await fetch(`${remoteUrl}/v1/story/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ imageUrl }), // Truyền đường dẫn ảnh
      });

      const data = await response.json();
      if (data.result) {
        toast.success("Tạo story thành công");
        setVisible(false);
        onButtonClick();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo story");
    } finally {
      hideLoading();
    }
  };

  const handleOpenCamera = async () => {
    setIsCameraActive(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        toast.error("Không thể truy cập camera của bạn");
      }
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        // Vẽ hình ảnh từ video vào canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Chuyển canvas thành hình ảnh base64
        const imageData = canvas.toDataURL("image/png");
        setImagePreview(imageData);

        // Tắt camera
        if (videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
        setIsCameraActive(false);

        // Tạo file hình ảnh từ dữ liệu base64
        const blob = dataURItoBlob(imageData);
        const file = new File([blob], "story.png", { type: "image/png" });
        setImageFile(file);
      }
    }
  };

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const buffer = new ArrayBuffer(byteString.length);
    const dataView = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      dataView[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeString });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={() => setVisible(false)}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Tạo Story</h2>

        <div className="border border-gray-300 rounded-lg p-4 mb-4 relative hover:border-blue-500">
          {isCameraActive ? (
            <>
              <video ref={videoRef} className="w-full h-64 rounded-lg mb-4" />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleCapturePhoto}
              >
                Chụp ảnh
              </button>
            </>
          ) : imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full object-contain rounded-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center h-32 cursor-pointer"
              >
                <PlusCircle className="w-10 h-10 text-gray-400" />
                <p className="text-gray-400 mt-2">Thêm hình ảnh</p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                className="flex items-center justify-center px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleOpenCamera}
              >
                <Camera className="w-5 h-5 mr-2" />
                Mở Camera
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => setVisible(false)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleCreateStory}
          >
            Tạo
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" width={640} height={480} />
      </div>
    </div>
  );
};

export default CreateStory;
