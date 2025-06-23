import { CancelButton } from "../../components/form/Button";
import {
  API_URL,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  LOCAL_STORAGE,
  QR_TIMEOUT,
  SOCKET_CMD,
  TOAST,
} from "../../services/constant";
import useApi from "../../hooks/useApi";
import { useEffect, useState, useRef, useCallback } from "react";
import { ActionSection, BasicCardForm } from "../../components/form/FormCard";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { generateUniqueId } from "../../services/utils";
import { QRCodeCanvas } from "qrcode.react";
import { AlertCircle } from "lucide-react";
import { setStorageData } from "../../services/storages";

const useWebSocketNoAuth = ({ clientId }: { clientId: string }) => {
  const [message, setMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const cleanup = useCallback(() => {
    ws.current?.close();
    ws.current = null;
    pingInterval.current && clearInterval(pingInterval.current);
    reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
  }, []);

  const sendMessage = useCallback((msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
      return true;
    }
    return false;
  }, []);

  const pollingLoginQrCode = useCallback(() => {
    sendMessage({
      app: "CLIENT_APP",
      cmd: "CLIENT_LOGIN_QR_CODE",
      data: { clientId },
    });
  }, [sendMessage, clientId]);

  const initializeWebSocket = useCallback(() => {
    const socket = new WebSocket(API_URL.SOCKET_URL);
    ws.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      pollingLoginQrCode();
      pingInterval.current = setInterval(pollingLoginQrCode, 30000);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessage(data);
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      cleanup();
      if (isMounted.current) {
        reconnectTimeout.current = setTimeout(connect, 2000);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close();
    };
  }, []);

  const connect = useCallback(() => {
    if (!isMounted.current || ws.current) return;
    cleanup();
    initializeWebSocket();
  }, []);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [connect, cleanup]);

  return { message, sendMessage };
};

const LoginQrCode = () => {
  const clientId = generateUniqueId();
  const navigate = useNavigate();
  const { setToast } = useGlobalContext();
  const { auth } = useApi();
  const [qrCode, setQrCode] = useState("");
  const { message } = useWebSocketNoAuth({ clientId });
  const [progress, setProgress] = useState(100);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    setProgress(100);
    if (timeoutRef.current) clearInterval(timeoutRef.current);

    const startTime = Date.now();
    timeoutRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, QR_TIMEOUT - elapsed);
      const newProgress = (remaining / QR_TIMEOUT) * 100;
      setProgress(newProgress);

      if (newProgress <= 0 && timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    }, 100);
  };

  useEffect(() => {
    const fetchQrCode = async () => {
      const res = await auth.requestLoginQrCode(clientId);
      if (res.result) {
        setQrCode(res.data);
        startProgress();
      } else {
        setToast(res.message, TOAST.ERROR);
      }
    };

    fetchQrCode();
    const qrInterval = setInterval(fetchQrCode, QR_TIMEOUT);

    return () => {
      clearInterval(qrInterval);
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (
      message?.responseCode == 200 &&
      message?.cmd == SOCKET_CMD.CMD_LOGIN_QR_CODE
    ) {
      if (message?.data?.accessToken) {
        setToast(BASIC_MESSAGES.LOGGED_IN, TOAST.SUCCESS);
        setStorageData(LOCAL_STORAGE.ACCESS_TOKEN, message?.data?.accessToken);
        window.location.href = "/";
      } else {
        setToast(BASIC_MESSAGES.LOG_IN_FAILED, TOAST.ERROR);
      }
    }
  }, [message]);

  return (
    <>
      <BasicCardForm title={BUTTON_TEXT.LOGIN_QR}>
        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-600 flex items-center justify-center">
            <AlertCircle size={16} className="mr-1" />
            Quét mã QR để đăng nhập vào ứng dụng
          </p>

          <div className="flex justify-center items-center">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeCanvas value={qrCode} size={250} />
            </div>
          </div>

          <div className="mx-4 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ActionSection>
            <CancelButton
              text={BUTTON_TEXT.BACK}
              onClick={() => navigate("/")}
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            />
          </ActionSection>
        </div>
      </BasicCardForm>
    </>
  );
};

export default LoginQrCode;
