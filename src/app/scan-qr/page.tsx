"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";

export default function ScanQR() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setHasPermission(result.state === "granted");

      if (result.state === "denied") {
        setError(
          "Permission caméra refusée. Veuillez autoriser  ll&apos;accèsapos;accès à la caméra."
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Fallback for browsers that don&apos;t support permissions API
      setHasPermission(null);
    }
  };

  const startScanning = async () => {
    if (!videoRef.current) return;

    setIsScanning(true);
    setError("");

    try {
      const qrScanner = new QrScanner(
        videoRef.current,
        async result => {
          console.log("QR Code détecté:", result.data);
          qrScanner.stop();

          // Vérifier si c&apos;est un QR code d&apos;établissement valide
          if (result.data.startsWith("fidelisation://establishment/")) {
            const establishmentId = result.data.replace(
              "fidelisation://establishment/",
              ""
            );
            // Stocker l&apos;établissement dans sessionStorage pour l&apos;utiliser plus tard
            sessionStorage.setItem("establishmentId", establishmentId);
            router.push("/");
          } else {
            setError(
              "QR code non reconnu. Veuillez scanner un QR code d&apos;établissement."
            );
            setIsScanning(false);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScanner.start();
    } catch (err) {
      console.error("Erreur lors du scan:", err);
      setError(
        "Erreur lors de lErreur lors de  ll&apos;accèsapos;accèsapos;accès à la caméra. Veuillez réessayer."
      );
      setIsScanning(false);
    }
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "Impossible d&apos;accéder à la caméra. Vérifiez vos permissions."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Scanner un QR Code
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          {hasPermission === null && (
            <button
              onClick={requestPermission}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700"
            >
              Autoriser la caméra
            </button>
          )}

          {hasPermission === false && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                L&apos;accès à la caméra est nécessaire pour scanner les QR
                codes.
              </p>
              <button
                onClick={requestPermission}
                className="bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700"
              >
                Demander la permission
              </button>
            </div>
          )}

          {hasPermission === true && !isScanning && (
            <button
              onClick={startScanning}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700"
            >
              Commencer le scan
            </button>
          )}

          {isScanning && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Scan en cours...</p>
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg border-2 border-gray-300"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none opacity-50"></div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-700"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
}
