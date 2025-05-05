const LOCAL_IP_ADDRESS = "finance-cache.onrender.com"; // change it

const getElement = (id) => document.getElementById(id);
const [
  btnConnect,
  btnToggleVideo,
  btnToggleAudio,
  divRoomConfig,
  roomDiv,
  roomNameInput,
  localVideo,
  remoteVideo,
  currentRoomName,
  waitingOverlay,
  leaveRoom,
] = [
  "btnConnect",
  "toggleVideo",
  "toggleAudio",
  "roomConfig",
  "roomDiv",
  "roomName",
  "localVideo",
  "remoteVideo",
  "currentRoomName",
  "waitingOverlay",
  "leaveRoom",
].map(getElement);

let remoteDescriptionPromise,
  roomName,
  localStream,
  remoteStream,
  rtcPeerConnection,
  isCaller;

// Improved ice servers config
const iceServers = {
  iceServers: [
    { urls: `stun:${LOCAL_IP_ADDRESS}:3478` },
    {
      urls: `turn:${LOCAL_IP_ADDRESS}:3478`,
      username: "username",
      credential: "password",
    },
  ],
};

const streamConstraints = { audio: true, video: true };

let socket = io.connect(`https://${LOCAL_IP_ADDRESS}`, { secure: true });
// let socket = io.connect("http://192.168.0.3:8000");

// Add event listeners
btnToggleVideo.addEventListener("click", () => toggleTrack("video"));
btnToggleAudio.addEventListener("click", () => toggleTrack("audio"));
leaveRoom.addEventListener("click", handleLeaveRoom);

// Add input event for room name to enable/disable connect button
roomNameInput.addEventListener("input", () => {
  btnConnect.disabled = roomNameInput.value.trim() === "";
});

// Add enter key support for room input
roomNameInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && roomNameInput.value.trim() !== "") {
    btnConnect.click();
  }
});

function toggleTrack(trackType) {
  if (!localStream) {
    return;
  }

  const track =
    trackType === "video"
      ? localStream.getVideoTracks()[0]
      : localStream.getAudioTracks()[0];
  const enabled = !track.enabled;
  track.enabled = enabled;

  const toggleButton = getElement(
    `toggle${trackType.charAt(0).toUpperCase() + trackType.slice(1)}`
  );
  const icon = getElement(`${trackType}Icon`);

  toggleButton.classList.toggle("disabled-style", !enabled);
  toggleButton.classList.toggle("enabled-style", enabled);

  if (trackType === "video") {
    icon.className = enabled ? "fas fa-video" : "fas fa-video-slash";
  } else {
    icon.className = enabled ? "fas fa-microphone" : "fas fa-microphone-slash";
  }
}

function handleLeaveRoom() {
  socket.disconnect();
  stopMediaTracks();
  divRoomConfig.classList.remove("d-none");
  roomDiv.classList.add("d-none");
  remoteVideo.srcObject = null;
  localVideo.srcObject = null;

  // Reset UI
  roomNameInput.value = "";
  btnToggleVideo.className = "control-button enabled-style";
  btnToggleAudio.className = "control-button enabled-style";
  getElement("videoIcon").className = "fas fa-video";
  getElement("audioIcon").className = "fas fa-microphone";

  // Reload page to reset all state
  window.location.reload();
}

function stopMediaTracks() {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
}

btnConnect.onclick = () => {
  const trimmedRoomName = roomNameInput.value.trim();
  if (trimmedRoomName === "") {
    showToast("Room name cannot be empty!");
  } else {
    roomName = trimmedRoomName;
    currentRoomName.textContent = roomName;
    socket.emit("joinRoom", roomName);
    divRoomConfig.classList.add("d-none");
    roomDiv.classList.remove("d-none");
  }
};

function showToast(message) {
  alert(message); // In a real implementation, replace with custom toast
}

const handleSocketEvent = (eventName, callback) =>
  socket.on(eventName, callback);

handleSocketEvent("created", (e) => {
  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then((stream) => {
      localStream = stream;
      localVideo.srcObject = stream;
      isCaller = true;
    })
    .catch((error) => {
      console.error("Error accessing media devices:", error);
      showToast("Failed to access camera/microphone!");
    });
});

handleSocketEvent("joined", (e) => {
  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then((stream) => {
      localStream = stream;
      localVideo.srcObject = stream;
      socket.emit("ready", roomName);
    })
    .catch((error) => {
      console.error("Error accessing media devices:", error);
      showToast("Failed to access camera/microphone!");
    });
});

handleSocketEvent("candidate", (e) => {
  if (rtcPeerConnection) {
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: e.label,
      candidate: e.candidate,
    });

    rtcPeerConnection.onicecandidateerror = (error) => {
      console.error("Error adding ICE candidate: ", error);
    };

    if (remoteDescriptionPromise) {
      remoteDescriptionPromise
        .then(() => {
          if (candidate != null) {
            return rtcPeerConnection.addIceCandidate(candidate);
          }
        })
        .catch((error) =>
          console.log(
            "Error adding ICE candidate after remote description: ",
            error
          )
        );
    }
  }
});

handleSocketEvent("ready", (e) => {
  if (isCaller) {
    waitingOverlay.style.display = "none";
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = onIceCandidate;
    rtcPeerConnection.ontrack = onAddStream;
    rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
    rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
    rtcPeerConnection
      .createOffer()
      .then((sessionDescription) => {
        rtcPeerConnection.setLocalDescription(sessionDescription);
        socket.emit("offer", {
          type: "offer",
          sdp: sessionDescription,
          room: roomName,
        });
      })
      .catch((error) => {
        console.error("Error creating offer:", error);
        showToast("Failed to establish connection!");
      });
  }
});

handleSocketEvent("offer", (e) => {
  if (!isCaller) {
    waitingOverlay.style.display = "none";
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = onIceCandidate;
    rtcPeerConnection.ontrack = onAddStream;
    rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
    rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);

    if (rtcPeerConnection.signalingState === "stable") {
      remoteDescriptionPromise = rtcPeerConnection.setRemoteDescription(
        new RTCSessionDescription(e)
      );
      remoteDescriptionPromise
        .then(() => {
          return rtcPeerConnection.createAnswer();
        })
        .then((sessionDescription) => {
          rtcPeerConnection.setLocalDescription(sessionDescription);
          socket.emit("answer", {
            type: "answer",
            sdp: sessionDescription,
            room: roomName,
          });
        })
        .catch((error) => {
          console.error("Error creating answer:", error);
          showToast("Failed to establish connection!");
        });
    }
  }
});

handleSocketEvent("answer", (e) => {
  if (isCaller && rtcPeerConnection.signalingState === "have-local-offer") {
    remoteDescriptionPromise = rtcPeerConnection.setRemoteDescription(
      new RTCSessionDescription(e)
    );
    remoteDescriptionPromise.catch((error) => {
      console.error("Error setting remote description:", error);
      showToast("Failed to establish connection!");
    });
  }
});

handleSocketEvent("userDisconnected", (e) => {
  remoteVideo.srcObject = null;
  isCaller = true;
  waitingOverlay.style.display = "flex";
  showToast("The other participant has left the room");
});

handleSocketEvent("setCaller", (callerId) => {
  isCaller = socket.id === callerId;
});

handleSocketEvent("full", (e) => {
  showToast("Room is full! Please try another room name.");
  window.location.reload();
});

const onIceCandidate = (e) => {
  if (e.candidate) {
    console.log("sending ice candidate");
    socket.emit("candidate", {
      type: "candidate",
      label: e.candidate.sdpMLineIndex,
      id: e.candidate.sdpMid,
      candidate: e.candidate.candidate,
      room: roomName,
    });
  }
};

const onAddStream = (e) => {
  remoteVideo.srcObject = e.streams[0];
  remoteStream = e.stream;
  waitingOverlay.style.display = "none";
};

// Add connection status indicator
rtcPeerConnection &&
  rtcPeerConnection.addEventListener("connectionstatechange", (event) => {
    const connectionState = rtcPeerConnection.connectionState;
    const statusIndicator = document.querySelector(".status-indicator i");

    if (connectionState === "connected") {
      statusIndicator.style.color = "#4cd964"; // Green
    } else if (connectionState === "connecting" || connectionState === "new") {
      statusIndicator.style.color = "#ffcc00"; // Yellow
    } else {
      statusIndicator.style.color = "#ff3b30"; // Red
    }
  });

// Initialize button state
btnConnect.disabled = true;

// Focus room input on load
window.addEventListener("DOMContentLoaded", () => {
  roomNameInput.focus();
});
