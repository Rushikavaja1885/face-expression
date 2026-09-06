
const BACKEND_URL = "http://127.0.0.1:8000";


// ============================================================
// IMAGE DETECTION
// ============================================================

export async function predictImage(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("emoji", "false");

  const response = await fetch(
    `${BACKEND_URL}/predict/predict/image`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Image prediction failed: ${response.status}`
    );
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
}


// ============================================================
// WEBCAM WEBSOCKET
// ============================================================

export function createWebSocket() {
  const socket = new WebSocket(
    "ws://127.0.0.1:8000/predict/ws"
  );

  return socket;
}


// ============================================================
// SEND WEBCAM FRAME
// ============================================================

export async function sendFrame(socket, imageDataUrl) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  const response = await fetch(imageDataUrl);

  const blob = await response.blob();

  const arrayBuffer = await blob.arrayBuffer();

  socket.send(arrayBuffer);
}
