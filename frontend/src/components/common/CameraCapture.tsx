import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, VideoOff } from 'lucide-react';
import { Button } from './Button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Stop camera tracks cleanly
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  // Start video stream
  const startCamera = async (deviceId?: string) => {
    stopStream();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('In-browser camera capture is not supported by your browser. Please use the file upload option.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video autoplay play error:', playErr);
        }
      }
      setIsStreaming(true);

      // Enumerate available video inputs
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(cameras);
        if (cameras.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(cameras[0].deviceId);
        }
      } catch (enumErr) {
        console.warn('Device enumeration error:', enumErr);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please grant camera permissions in your browser settings or upload a photograph directly.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was detected on your system. Please upload a photograph directly.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('The camera is currently in use by another application. Please close the other application and try again.');
      } else {
        setCameraError(`Unable to start camera: ${err.message || 'Unknown hardware error'}. Please use the file upload option.`);
      }
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
      if (capturedUrl) {
        URL.revokeObjectURL(capturedUrl);
      }
    };
  }, []);

  // Handle single-frame capture
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          const url = URL.createObjectURL(blob);
          setCapturedUrl(url);
          stopStream(); // Freeze/stop camera stream immediately upon capture
        }
      },
      'image/jpeg',
      0.92
    );
  };

  // Handle retake
  const handleRetake = () => {
    if (capturedUrl) {
      URL.revokeObjectURL(capturedUrl);
    }
    setCapturedBlob(null);
    setCapturedUrl(null);
    startCamera(selectedDeviceId);
  };

  // Confirm photo and create File object
  const handleUsePhoto = () => {
    if (!capturedBlob) return;

    const file = new File([capturedBlob], `camera_capture_${Date.now()}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    onCapture(file);
  };

  const handleClose = () => {
    stopStream();
    onCancel();
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-health-50 dark:bg-health-950/60 text-health-600 dark:text-health-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Camera Frame Capture</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Hold the camera steady in a well-lit environment</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {cameraError ? (
        <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 mx-auto flex items-center justify-center">
            <VideoOff className="w-5 h-5" />
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">{cameraError}</p>
          <Button variant="outline" size="sm" onClick={() => startCamera(selectedDeviceId)}>
            Try Again
          </Button>
        </div>
      ) : capturedUrl ? (
        // Preview Captured Still Frame
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80 flex items-center justify-center bg-slate-950">
            <img src={capturedUrl} alt="Captured Still Frame" className="object-contain max-h-80 w-full" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={handleRetake} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Retake Photo
            </Button>
            <Button variant="primary" size="md" onClick={handleUsePhoto} leftIcon={<Check className="w-4 h-4" />}>
              Use This Photo
            </Button>
          </div>
        </div>
      ) : (
        // Live Viewfinder
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 max-h-80 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-80 object-cover"
            />
            {isStreaming && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>LIVE CAMERA</span>
              </div>
            )}
          </div>

          {/* Camera Selector (if multiple) */}
          {videoDevices.length > 1 && (
            <div className="flex items-center gap-2 text-xs">
              <label className="text-slate-500 font-medium">Switch Camera:</label>
              <select
                value={selectedDeviceId}
                onChange={(e) => {
                  setSelectedDeviceId(e.target.value);
                  startCamera(e.target.value);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                {videoDevices.map((dev) => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.label || `Camera ${dev.deviceId.slice(0, 5)}...`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              variant="primary"
              size="lg"
              disabled={!isStreaming}
              onClick={handleCaptureFrame}
              leftIcon={<Camera className="w-5 h-5" />}
            >
              Capture Frame
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
