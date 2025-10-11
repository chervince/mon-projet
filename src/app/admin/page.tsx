/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Merchant {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  creditPercentage: number;
  threshold: number;
  validityMonths: number;
  merchantCode: string;
  qrCode: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalMerchants: number;
  totalCreditsDistributed: number;
  totalVouchersGenerated: number;
  totalScans: number;
  recentScans: Array<{
    id: string;
    userName: string;
    merchantName: string;
    ticketAmount: number;
    creditsEarned: number;
    timestamp: string;
    ip?: string;
  }>;
}

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [newMerchant, setNewMerchant] = useState({
    name: "",
    logo: "",
    address: "",
    creditPercentage: 10.0,
    threshold: 2000.0,
    validityMonths: 6,
    merchantCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
    } else {
      checkAdminRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const checkAdminRole = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/check-role");
      const data = await response.json();
      if (data.role === "admin") {
        setIsAdmin(true);
        fetchStats();
        fetchMerchants();
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error checking role:", error);
      router.push("/admin/login");
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchMerchants = async () => {
    try {
      const response = await fetch("/api/admin/establishments");
      const data = await response.json();
      setMerchants(data.merchants);
    } catch (error) {
      console.error("Error fetching merchants:", error);
    }
  };

  const generateMerchantCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewMerchant({ ...newMerchant, merchantCode: code });
  };

  const createMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/establishments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMerchant),
      });

      const data = await response.json();

      if (response.ok) {
        setNewMerchant({
          name: "",
          logo: "",
          address: "",
          creditPercentage: 10.0,
          threshold: 2000.0,
          validityMonths: 6,
          merchantCode: "",
        });
        fetchMerchants();
        fetchStats();
      } else {
        setError(data.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating merchant:", error);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (merchant: Merchant) => {
    alert(
      `QR Code URL: ${merchant.qrCode}\n\nUtilisez un générateur de QR code en ligne avec cette URL.`
    );
  };

  if (status === "loading" || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Vérification des droits d'accès...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Retour au dashboard
          </button>
        </div>

        {/* Statistiques globales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">Utilisateurs</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalMerchants}
              </div>
              <div className="text-sm text-gray-600">Marchands</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalCreditsDistributed.toLocaleString()} XPF
              </div>
              <div className="text-sm text-gray-600">Crédits distribués</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalVouchersGenerated}
              </div>
              <div className="text-sm text-gray-600">Bons générés</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.totalScans}
              </div>
              <div className="text-sm text-gray-600">Scans totaux</div>
            </div>
          </div>
        )}

        {/* Activité récente */}
        {stats && stats.recentScans.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
            <div className="space-y-3">
              {stats.recentScans.map(scan => (
                <div
                  key={scan.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{scan.userName}</div>
                    <div className="text-sm text-gray-600">
                      {scan.merchantName} - {scan.ticketAmount.toLocaleString()}{" "}
                      XPF
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      +{scan.creditsEarned.toLocaleString()} XPF
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Créer un marchand */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Créer un marchand</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={createMerchant} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du marchand ***
                  </label>
                  <input
                    type="text"
                    value={newMerchant.name}
                    onChange={e =>
                      setNewMerchant({
                        ...newMerchant,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code marchand (4 caractères) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMerchant.merchantCode}
                      onChange={e =>
                        setNewMerchant({
                          ...newMerchant,
                          merchantCode: e.target.value.toUpperCase(),
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase"
                      maxLength={4}
                      required
                    />
                    <button
                      type="button"
                      onClick={generateMerchantCode}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Générer
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={newMerchant.address}
                    onChange={e =>
                      setNewMerchant({
                        ...newMerchant,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Logo
                  </label>
                  <input
                    type="url"
                    value={newMerchant.logo}
                    onChange={e =>
                      setNewMerchant({
                        ...newMerchant,
                        logo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      % Crédits (1-20%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="20"
                      value={newMerchant.creditPercentage}
                      onChange={e =>
                        setNewMerchant({
                          ...newMerchant,
                          creditPercentage: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seuil (XPF ≥500)
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      value={newMerchant.threshold}
                      onChange={e =>
                        setNewMerchant({
                          ...newMerchant,
                          threshold: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validité (mois ≥3)
                    </label>
                    <input
                      type="number"
                      min="3"
                      value={newMerchant.validityMonths}
                      onChange={e =>
                        setNewMerchant({
                          ...newMerchant,
                          validityMonths: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer le marchand"}
              </button>
            </form>
          </div>

          {/* Liste des marchands */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Marchands ({merchants.length})
            </h2>
            {merchants.length === 0 ? (
              <p className="text-gray-600">Aucun marchand créé.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {merchants.map(merchant => (
                  <div
                    key={merchant.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {merchant.logo && (
                            <Image
                              width={40}
                              height={40}
                              src={merchant.logo}
                              alt={merchant.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {merchant.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {merchant.address}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Code:</span>{" "}
                            {merchant.merchantCode}
                          </div>
                          <div>
                            <span className="font-medium">% Crédits:</span>{" "}
                            {merchant.creditPercentage}%
                          </div>
                          <div>
                            <span className="font-medium">Seuil:</span>{" "}
                            {merchant.threshold} XPF
                          </div>
                          <div>
                            <span className="font-medium">Validité:</span>{" "}
                            {merchant.validityMonths} mois
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Créé le{" "}
                          {new Date(merchant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadQR(merchant)}
                        className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 ml-4"
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
    </div>
  );
}
export const dynamic = "force-dynamic";
