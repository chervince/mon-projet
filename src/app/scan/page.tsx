/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/bottom-nav";

export default function ScanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [cameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      initializeCamera();
    }
  }, [session, status, router]);

  const initializeCamera = async () => {
    try {
      // Vérifier les permissions
      const permission = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      if (permission.state === "denied") {
        setError(
          "Permission caméra refusée. Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur."
        );
        return;
      }

      // Accéder à la caméra
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Caméra arrière
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      setCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Erreur caméra:", err);
      setError(
        "Impossible d'accéder à la caméra. Vérifiez que votre appareil en possède une et que les permissions sont accordées."
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Ajuster la taille du canvas à la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir en blob
    canvas.toBlob(
      async blob => {
        if (blob) {
          await processTicket(blob);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const processTicket = async (imageBlob: Blob) => {
    setIsScanning(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("ticket", imageBlob, "ticket.jpg");

      const response = await fetch("/api/scan/process", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Rediriger vers page de résultats avec les données
        router.push(
          `/scan/result?data=${encodeURIComponent(JSON.stringify(result))}`
        );
      } else {
        setError(result.error || "Erreur lors du traitement du ticket");
      }
    } catch (err) {
      console.error("Erreur traitement:", err);
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsScanning(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="bg-black text-white p-4 safe-area-top">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Scanner un ticket</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      {/* Zone caméra */}
      <div className="relative flex-1">
        {!cameraPermission ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center text-white">
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Accès à la caméra</h2>
              <p className="text-gray-300 mb-6">
                Nous avons besoin d'accéder à votre caméra pour scanner les
                tickets de caisse.
              </p>
              <button
                onClick={initializeCamera}
                className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Autoriser la caméra
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Vidéo caméra */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }} // Miroir pour caméra frontale
            />

            {/* Overlay de ciblage */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-40 border-2 border-white border-dashed rounded-lg opacity-70">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                    Cadrez votre ticket
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton capture */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
              <button
                onClick={capturePhoto}
                disabled={isScanning}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="w-12 h-12 bg-indigo-600 rounded-full"></div>
                )}
              </button>
            </div>

            {/* Indicateur flash */}
            {isScanning && (
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            )}
          </>
        )}

        {/* Canvas caché pour capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="absolute bottom-32 left-4 right-4 bg-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-20 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Conseils pour un bon scan :</h3>
        <ul className="text-sm space-y-1">
          <li>• Placez le ticket bien à plat</li>
          <li>• Éclairez correctement le ticket</li>
          <li>• Vérifiez que le montant est lisible</li>
          <li>• Évitez les reflets et les ombres</li>
        </ul>
      </div>

      {/* Navigation Bottom */}
      <BottomNav />
    </div>
  );
}
