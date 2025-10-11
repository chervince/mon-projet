"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNav from "@/components/navigation/bottom-nav";

interface UserCredits {
  merchantId: string;
  merchantName: string;
  merchantLogo?: string;
  totalCredits: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userCredits, setUserCredits] = useState<UserCredits[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      fetchUserCredits();
    }
  }, [session, status, router]);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch("/api/user/credits");
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits);
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
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

  // Trier par crédits décroissants et prendre top 3
  const topCredits = userCredits
    .sort((a, b) => b.totalCredits - a.totalCredits)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour {session.user?.name || "Utilisateur"}
          </h1>
          <p className="text-gray-600">
            Découvrez vos crédits et commencez à scanner !
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Palmarès Top 3 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🏆 Vos meilleurs soldes
          </h2>

          {topCredits.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                Aucun crédit pour le moment
              </p>
              <p className="text-sm text-gray-500">
                Scannez votre premier ticket pour commencer !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCredits.map((credit, index) => (
                <div
                  key={credit.merchantId}
                  className={`flex items-center p-4 rounded-lg ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200"
                      : "bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200"
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    {credit.merchantLogo ? (
                      <Image
                        src={credit.merchantLogo}
                        alt={credit.merchantName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600">
                          {credit.merchantName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {credit.merchantName}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        index === 0
                          ? "bg-yellow-200 text-yellow-800"
                          : index === 1
                          ? "bg-gray-200 text-gray-800"
                          : "bg-orange-200 text-orange-800"
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {credit.totalCredits.toLocaleString()} XPF
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton principal Scan */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Scanner un ticket
            </h3>
            <p className="text-gray-600 mb-6">
              Photographiez votre ticket de caisse pour gagner des crédits
            </p>
            <button
              onClick={() => router.push("/scan")}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Commencer le scan
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {userCredits.length}
            </div>
            <div className="text-sm text-gray-600">Partenaires</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {userCredits.reduce((sum, credit) => sum + credit.totalCredits, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total crédits</div>
          </div>
        </div>
      </div>

      {/* Navigation Bottom */}
      <BottomNav />
    </div>
  );
}
