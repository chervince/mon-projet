"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Fidélisation PME
        </h1>
        <p className="text-gray-600 mb-6">Scannez un QR code dans un point de vente pour accéder à l<p className="text-gray-600 mb-8">apos;app.</p><p className="text-gray-600 mb-8">Ou créez un compte pour commencer.</p>
          Scannez vos tickets de caisse et accumulez des points de fidélité !
        </p>
        <div className="space-y-4">
          <Link
            href="/scan-qr"
            className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Scanner un QR Code
          </Link>
          <Link
            href="/auth/signup"
            className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Créer un compte
          </Link>
          <Link
            href="/auth/signin"
            className="block w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}