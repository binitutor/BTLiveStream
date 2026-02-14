import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

function Hero() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const callPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startLocalStream = async () => {
    if (localStream) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      Swal.fire({
        title: 'Camera access blocked',
        text: 'Please allow camera and microphone permissions to start a live session.',
        icon: 'error',
        confirmButtonColor: '#234756',
      });
    }
  };

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleStartSession = async () => {
    if (!localStream) {
      await startLocalStream();
    }
    setSessionActive(true);
    Swal.fire({
      title: 'Live session started',
      text: 'Your camera is live and ready for peer-to-peer connections.',
      icon: 'success',
      confirmButtonColor: '#234756',
    });
  };

  const handleToggleCamera = async () => {
    if (localStream) {
      stopLocalStream();
    } else {
      await startLocalStream();
    }
  };

  const handleToggleMic = async () => {
    if (!localStream) {
      await startLocalStream();
    }
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const handleEndSession = () => {
    setSessionActive(false);
    stopLocalStream();
    if (isFullscreen) {
      setIsFullscreen(false);
    }
    Swal.fire({
      title: 'Session ended',
      text: 'Your live session has been closed.',
      icon: 'info',
      confirmButtonColor: '#234756',
    });
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleStartRecording = () => {
    if (!localStream) {
      Swal.fire({
        title: 'Camera not active',
        text: 'Please start your camera before recording.',
        icon: 'warning',
        confirmButtonColor: '#234756',
      });
      return;
    }

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(localStream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().getTime()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Swal.fire({
        title: 'Recording saved',
        text: 'Your session recording has been downloaded.',
        icon: 'success',
        confirmButtonColor: '#234756',
      });
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);

    Swal.fire({
      title: 'Recording started',
      text: 'Your live session is now being recorded.',
      icon: 'info',
      confirmButtonColor: '#234756',
    });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  useEffect(() => {
    return () => {
      stopLocalStream();
    };
  }, []);

  return (
    <header className="hero-section">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-lg-6">
            <p className="badge bg-secondary-subtle text-primary fw-semibold">
              Secure P2P Video
            </p>
            <h1 className="display-5 fw-bold text-primary">
              Crystal-clear peer-to-peer live calls
            </h1>
            <p className="lead text-muted">
              BT Live Stream connects teams instantly with encrypted, low-latency video.
              Monitor engagement, manage sessions, and keep every call running smoothly.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button className="btn btn-primary btn-lg">Launch Meeting</button>
              <button className="btn btn-outline-primary btn-lg">Schedule Session</button>
            </div>
            <div className="mt-4 d-flex flex-wrap gap-4">
              <div>
                <h4 className="text-primary fw-bold mb-0">99.9%</h4>
                <small className="text-muted">Uptime</small>
              </div>
              <div>
                <h4 className="text-primary fw-bold mb-0">1.2s</h4>
                <small className="text-muted">Avg. Latency</small>
              </div>
              <div>
                <h4 className="text-primary fw-bold mb-0">128-bit</h4>
                <small className="text-muted">Encryption</small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div
              ref={callPreviewRef}
              className={`call-preview ${isFullscreen ? 'fullscreen' : ''}`}
            >
              <div className="call-preview__header">
                <div>
                  <h5 className="mb-1">Live Call Preview</h5>
                  <small className="text-muted">Room: BT-8921-ALPHA</small>
                </div>
                <span className="status-pill">LIVE</span>
              </div>
              <div className="call-preview__grid">
                <div className="video-tile video-tile--primary video-tile--live">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                  ></video>
                  <span>Local Camera</span>
                </div>
                <div className="video-tile">
                  <span>Guest A</span>
                </div>
                <div className="video-tile">
                  <span>Guest B</span>
                </div>
                <div className="video-tile">
                  <span>Guest C</span>
                </div>
              </div>
              <div className="call-preview__controls">
                <button
                  className="btn btn-primary"
                  onClick={handleStartSession}
                  disabled={sessionActive}
                >
                  Start Live Session
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleToggleCamera}
                >
                  {localStream ? 'Turn Off Camera' : 'Turn On Camera'}
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleToggleMic}
                >
                  {localStream?.getAudioTracks().some((t) => t.enabled)
                    ? 'Mute'
                    : 'Unmute'}
                </button>
                <button
                  className={`btn ${isRecording ? 'btn-danger' : 'btn-outline-primary'}`}
                  onClick={handleToggleRecording}
                  disabled={!sessionActive}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <i className="bi bi-camera-video" style={{ marginRight: '6px' }}></i>
                  {isRecording ? 'Stop Recording' : 'Record'}
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleToggleFullscreen}
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleEndSession}
                  disabled={!sessionActive}
                >
                  End
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
