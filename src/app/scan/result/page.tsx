"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/bottom-nav";

interface ScanResult {
  success: boolean;
  merchant?: {
    name: string;
    creditPercentage: number;
  };
  ticketAmount?: number;
  creditsEarned?: number;
  totalCredits?: number;
  voucherGenerated?: {
    id: string;
    amount: number;
    merchantCode: string;
  };
  error?: string;
}

export default function ScanResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(dataParam));
        setResult(parsedResult);
      } catch (error) {
        console.error("Error parsing result data:", error);
        setResult({ success: false, error: "Erreur lors du traitement des données" });
      }
    } else {
      router.push('/scan');
    }
  }, [searchParams, router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/scan')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">
              {result.success ? "Scan réussi !" : "Erreur de scan"}
            </h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto px-4 py-6">
        {result.success ? (
          <div className="space-y-6">
            {/* Animation de succès */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ticket traité avec succès !
              </h2>
              <p className="text-gray-600">
                Vos crédits ont été ajoutés à votre compte
              </p>
            </div>

            {/* Détails du scan */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de la transaction
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Marchand</span>
                  <span className="font-semibold">{result.merchant?.name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Montant du ticket</span>
                  <span className="font-semibold">{result.ticketAmount?.toLocaleString()} XPF</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">% Crédits</span>
                  <span className="font-semibold">{result.merchant?.creditPercentage}%</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-900">Crédits gagnés</span>
                    <span className="text-lg font-bold text-green-600">
                      +{result.creditsEarned?.toLocaleString()} XPF
                    </span>
                  </div>
                </div>

                {result.totalCredits !== undefined && (
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-600">Total crédits chez ce marchand</span>
                    <span className="font-semibold">{result.totalCredits.toLocaleString()} XPF</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bon généré */}
            {result.voucherGenerated && (
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-2">
                    🎉 Bon d'achat généré !
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    Félicitations ! Vous avez atteint le seuil et obtenu un bon de {result.voucherGenerated.amount.toLocaleString()} XPF
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Code marchand</p>
                    <p className="text-xl font-mono font-bold text-gray-900">
                      {result.voucherGenerated.merchantCode}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/vouchers')}
                    className="bg-yellow-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Voir mes bons
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/scan')}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Scanner un autre ticket
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Animation d'erreur */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Scan échoué
              </h2>
              <p className="text-gray-600">
                {result.error || "Une erreur est survenue lors du traitement du ticket"}
              </p>
            </div>

            {/* Conseils */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Conseils pour réussir votre scan
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs font-medium text-indigo-600">1</span>
                  </span>
                  Assurez-vous que le ticket est bien éclairé
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs font-medium text-indigo-600">2</span>
                  </span>
                  Vérifiez que le montant total est visible
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs font-medium text-indigo-600">3</span>
                  </span>
                  Évitez les reflets et les ombres
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-xs font-medium text-indigo-600">4</span>
                  </span>
                  Le ticket doit provenir d'un marchand partenaire
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/scan')}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Réessayer
              </button>

              <button
                onClick={() => router.push('/partners')}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Voir les marchands partenaires
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bottom */}
      <BottomNav />
    </div>
  );
}