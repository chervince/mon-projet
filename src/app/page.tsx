"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Merchant {
  id: string;
  name: string;
  logo?: string;
  address?: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Détecter le marchand depuis l'URL (QR scan)
  useEffect(() => {
    const merchantId = searchParams.get("merchant");
    if (merchantId) {
      fetchMerchant(merchantId);
    }
  }, [searchParams]);

  // Détecter le prompt d'installation PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const fetchMerchant = async (merchantId: string) => {
    try {
      const response = await fetch(`/api/merchants/${merchantId}`);
      if (response.ok) {
        const data = await response.json();
        setMerchant(data.merchant);
      }
    } catch (error) {
      console.error("Error fetching merchant:", error);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // Redirection si déjà connecté
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header avec logo marchand si détecté */}
      {merchant && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-6 text-center">
            {merchant.logo && (
              <div className="mb-4">
                <Image
                  src={merchant.logo}
                  alt={merchant.name}
                  width={80}
                  height={80}
                  className="mx-auto rounded-full object-cover"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Bienvenue chez {merchant.name}
            </h1>
            {merchant.address && (
              <p className="text-gray-600">{merchant.address}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Scannez vos tickets et gagnez des crédits !
            </p>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12">
        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Logo et titre principal */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Fidélisation PME
            </h2>
            <p className="text-gray-600">
              Gagnez des crédits en scannant vos tickets de caisse
            </p>
          </div>

          {/* Actions principales */}
          <div className="space-y-4">
            <Link
              href="/auth/signup"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Créer un compte
            </Link>

            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">ou</span>
              </div>
            </div>

            <button
              onClick={() => {/* TODO: Google OAuth */}}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          {/* Fonctionnalités */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comment ça marche ?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">1</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Inscrivez-vous</strong> gratuitement
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">2</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Scannez vos tickets</strong> en magasin
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">3</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Gagnez des crédits</strong> automatiquement
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">4</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Échangez contre des bons</strong> d'achat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Installation PWA */}
      {showInstallPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Installer l'application
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Installez Fidélisation PME sur votre téléphone pour un accès rapide et hors ligne.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Plus tard
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Installer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
