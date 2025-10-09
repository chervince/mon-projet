"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Establishment {
  id: string;
  name: string;
  qrCode: string;
  pointsPerEuro: number;
  createdAt: string;
}

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [newEstablishment, setNewEstablishment] = useState({
    name: "",
    pointsPerEuro: 1.0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      fetchEstablishments();
    }
  }, [session, status, router]);

  const fetchEstablishments = async () => {
    try {
      const response = await fetch("/api/admin/establishments");
      const data = await response.json();
      setEstablishments(data.establishments);
    } catch (error) {
      console.error("Error fetching establishments:", error);
    }
  };

  const createEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/establishments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEstablishment),
      });

      if (response.ok) {
        setNewEstablishment({ name: "", pointsPerEuro: 1.0 });
        fetchEstablishments();
      }
    } catch (error) {
      console.error("Error creating establishment:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (establishment: Establishment) => {
    // Pour l'instant, on affiche juste l'URL du QR
    alert(`QR Code URL: ${establishment.qrCode}\n\nUtilisez un générateur de QR code en ligne avec cette URL.`);
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Retour au dashboard
          </button>
        </div>

        {/* Créer un établissement */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Créer un établissement</h2>
          <form onSubmit={createEstablishment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de lNom de ll'établissementapos;établissementapos;établissement
                </label>
                <input
                  type="text"
                  value={newEstablishment.name}
                  onChange={(e) => setNewEstablishment({ ...newEstablishment, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points par euro
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newEstablishment.pointsPerEuro}
                  onChange={(e) => setNewEstablishment({ ...newEstablishment, pointsPerEuro: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  min="0.1"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer ll'établissementapos;établissement"}
            </button>
          </form>
        </div>

        {/* Liste des établissements */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Établissements</h2>
          {establishments.length === 0 ? (
            <p className="text-gray-600">Aucun établissement créé.</p>
          ) : (
            <div className="space-y-4">
              {establishments.map((establishment) => (
                <div key={establishment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{establishment.name}</h3>
                      <p className="text-sm text-gray-600">
                        {establishment.pointsPerEuro} point(s) par euro
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Créé le {new Date(establishment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadQR(establishment)}
                      className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
                    >
                      QR Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}