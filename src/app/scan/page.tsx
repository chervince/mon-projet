"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Scan() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Scanner un ticket
          </h1>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Fonctionnalité de scan en développement...
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}