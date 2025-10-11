"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/bottom-nav";

interface Voucher {
  id: string;
  merchantName: string;
  merchantCode: string;
  amount: number;
  qrCode: string;
  createdAt: string;
}

export default function VouchersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      fetchVouchers();
    }
  }, [session, status, router]);

  const fetchVouchers = async () => {
    try {
      const response = await fetch("/api/user/vouchers");
      if (response.ok) {
        const data = await response.json();
        setVouchers(data.vouchers);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mes Bons d'Achat
          </h1>
          <p className="text-gray-600">
            Utilisez vos bons dans les magasins partenaires
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto px-4 py-6">
        {vouchers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Aucun bon disponible
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Accumulez des crédits en scannant vos tickets pour obtenir des bons d'achat
            </p>
            <button
              onClick={() => router.push("/scan")}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Commencer à scanner
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{vouchers.length}</div>
                <div className="text-sm text-gray-600">Bon(s) actif(s)</div>
              </div>
            </div>

            {/* Liste des bons */}
            <div className="space-y-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Bon d'achat {voucher.merchantName}
                    </h3>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {voucher.amount.toLocaleString()} XPF
                    </div>
                    <p className="text-sm text-gray-600">
                      Généré le {new Date(voucher.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* QR Code simulé (pour l'instant) */}
                  <div className="flex justify-center mb-6">
                    <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01" />
                        </svg>
                        <p className="text-xs text-gray-500">QR Code</p>
                        <p className="text-xs text-gray-400 mt-1">Simulé</p>
                      </div>
                    </div>
                  </div>

                  {/* Code marchand */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Code marchand</p>
                      <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                        {voucher.merchantCode}
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-center text-sm text-gray-600 space-y-2">
                    <p>
                      <strong>En caisse :</strong> Montrez ce QR code ou saisissez le code marchand
                    </p>
                    <p>
                      <strong>Remise :</strong> {voucher.amount.toLocaleString()} XPF à appliquer sur votre achat
                    </p>
                    <p className="text-xs text-gray-500">
                      Bon utilisable une seule fois chez {voucher.merchantName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bottom */}
      <BottomNav />
    </div>
  );
}