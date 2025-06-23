import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  API_URL,
  ICE_SERVERS,
  STREAM_CONSTRAINTS,
  TOAST,
} from "../../../services/constant";
import VideoRoom from "./VideoRoom";
import { useGlobalContext } from "../../../components/config/GlobalProvider";

interface VideoChatModalProps {
  conversation: any;
  closeModal: () => void;
}

const VideoChatModal = ({ conversation, closeModal }: VideoChatModalProps) => {
  const { setToast } = useGlobalContext();
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [connectionState, setConnectionState] = useState<string>("new");
  const [showWaiting, setShowWaiting] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const isCallerRef = useRef<boolean>(false);
  const remoteDescriptionPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    socketRef.current = io.connect(`https://${API_URL.CHAT_VIDEO_URL}`, {
      secure: true,
    });

    const socket = socketRef.current;
    socket.on("created", handleCreated);
    socket.on("joined", handleJoined);
    socket.on("candidate", handleCandidate);
    socket.on("ready", handleReady);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("userDisconnected", handleUserDisconnected);
    socket.on("setCaller", handleSetCaller);
    socket.on("full", handleFull);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (conversation?.id) {
      const roomName = `room-${conversation.id}`;
      handleJoinRoom(roomName);
    }
  }, [conversation]);

  const handleCreated = async () => {
    setConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        STREAM_CONSTRAINTS
      );
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      isCallerRef.current = true;
      setShowWaiting(true);
    } catch (error) {
      setToast("Failed to access camera/microphone", TOAST.ERROR);
    } finally {
      setConnecting(false);
    }
  };

  const handleJoined = async () => {
    setConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        STREAM_CONSTRAINTS
      );
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      socketRef.current?.emit("ready", currentRoom);
      setShowWaiting(true);
    } catch (error) {
      setToast("Failed to access camera/microphone", TOAST.ERROR);
    } finally {
      setConnecting(false);
    }
  };

  const handleCandidate = async (e: any) => {
    if (peerConnectionRef.current && e.candidate && e.label !== undefined) {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: e.label,
        candidate: e.candidate,
      });

      try {
        if (remoteDescriptionPromiseRef.current) {
          await remoteDescriptionPromiseRef.current;
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  };

  const handleReady = async () => {
    if (isCallerRef.current) {
      setShowWaiting(false);
      peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);
      const pc = peerConnectionRef.current;
      pc.onicecandidate = onIceCandidate;
      pc.ontrack = onAddStream;
      pc.addEventListener("connectionstatechange", handleConnectionStateChange);

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStreamRef.current!));
      }

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit("offer", {
          type: "offer",
          sdp: offer,
          room: currentRoom,
        });
      } catch (error) {
        setToast("Failed to establish connection", TOAST.ERROR);
      }
    }
  };

  const handleOffer = async (e: RTCSessionDescriptionInit) => {
    if (!isCallerRef.current) {
      setShowWaiting(false);
      peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);
      const pc = peerConnectionRef.current;
      pc.onicecandidate = onIceCandidate;
      pc.ontrack = onAddStream;
      pc.addEventListener("connectionstatechange", handleConnectionStateChange);

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStreamRef.current!));
      }

      if (pc.signalingState === "stable") {
        try {
          remoteDescriptionPromiseRef.current = pc.setRemoteDescription(
            new RTCSessionDescription(e)
          );
          await remoteDescriptionPromiseRef.current;
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current?.emit("answer", {
            type: "answer",
            sdp: answer,
            room: currentRoom,
          });
        } catch (error) {
          setToast("Failed to establish connection", TOAST.ERROR);
        }
      }
    }
  };

  const handleAnswer = async (e: RTCSessionDescriptionInit) => {
    if (
      isCallerRef.current &&
      peerConnectionRef.current?.signalingState === "have-local-offer"
    ) {
      try {
        remoteDescriptionPromiseRef.current =
          peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(e)
          );
        await remoteDescriptionPromiseRef.current;
      } catch (error) {
        setToast("Failed to establish connection", TOAST.ERROR);
      }
    }
  };

  const handleUserDisconnected = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    isCallerRef.current = true;
    setShowWaiting(true);
    setToast(`${conversation?.name} đã ngắt kết nối`, TOAST.INFO);
  };

  const handleSetCaller = (callerId: string) => {
    isCallerRef.current = socketRef.current?.id === callerId;
  };

  const handleFull = () => {
    setToast("Phòng đã đầy", TOAST.WARN);
    closeModal();
  };

  const onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
    if (e.candidate) {
      socketRef.current?.emit("candidate", {
        type: "candidate",
        label: e.candidate.sdpMLineIndex,
        id: e.candidate.sdpMid,
        candidate: e.candidate.candidate,
        room: currentRoom,
      });
    }
  };

  const onAddStream = (e: RTCTrackEvent) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = e.streams[0];
      remoteStreamRef.current = e.streams[0];
      setShowWaiting(false);
    }
  };

  const handleConnectionStateChange = () => {
    if (peerConnectionRef.current) {
      setConnectionState(peerConnectionRef.current.connectionState);
    }
  };

  const toggleTrack = (trackType: "video" | "audio") => {
    if (!localStreamRef.current) return;

    const track =
      trackType === "video"
        ? localStreamRef.current.getVideoTracks()[0]
        : localStreamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;

    if (trackType === "video") {
      setIsVideoEnabled(track.enabled);
    } else {
      setIsAudioEnabled(track.enabled);
    }
  };

  const handleJoinRoom = (roomName: string) => {
    setCurrentRoom(roomName);
    socketRef.current?.emit("joinRoom", roomName);
    setIsConnected(true);
  };

  const handleLeaveRoom = () => {
    socketRef.current?.disconnect();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setIsConnected(false);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);
    setShowWaiting(false);
    closeModal();
  };

  if (!conversation) {
    return null;
  }

  return (
    <div
      style={{ zIndex: 50 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-800">
        {isConnected && (
          <VideoRoom
            conversation={conversation}
            connectionState={connectionState}
            showWaiting={showWaiting}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            toggleTrack={toggleTrack}
            handleLeaveRoom={handleLeaveRoom}
            connecting={connecting}
          />
        )}
      </div>
    </div>
  );
};

export default VideoChatModal;
