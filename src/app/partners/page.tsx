"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNav from "@/components/navigation/bottom-nav";

interface Partner {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  creditPercentage: number;
  threshold: number;
  userCredits: number;
}

export default function PartnersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      fetchPartners();
    }
  }, [session, status, router]);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/partners");
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
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
            Nos Partenaires
          </h1>
          <p className="text-gray-600">
            Découvrez tous les commerces partenaires
          </p>
        </div>
      </div>

      {/* Liste des partenaires */}
      <div className="max-w-md mx-auto px-4 py-6">
        {partners.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-600">
              Aucun partenaire disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/partners/${partner.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-600">
                          {partner.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {partner.name}
                      </h3>
                      {partner.address && (
                        <p className="text-sm text-gray-600">{partner.address}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {partner.creditPercentage}% de crédits
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {partner.userCredits.toLocaleString()} XPF
                    </div>
                    <div className="text-sm text-gray-600">Vos crédits</div>
                  </div>
                </div>

                {/* Barre de progression vers le seuil */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Prochain bon à {partner.threshold.toLocaleString()} XPF</span>
                    <span>{Math.round((partner.userCredits / partner.threshold) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((partner.userCredits / partner.threshold) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Bouton scan */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/scan");
                  }}
                  className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Scanner chez ce partenaire
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Bottom */}
      <BottomNav />
    </div>
  );
}