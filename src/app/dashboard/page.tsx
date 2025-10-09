"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Bonjour {session.user.name}
          </h1>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              0 {/* TODO: afficher points réels */}
            </div>
            <p className="text-gray-600">Points de fidélité</p>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <Link
            href="/admin"
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-purple-700 transition-colors"
          >
            Administration
          </Link>
        </div>
        <Link
          href="/scan"
          className="block w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-medium text-center hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Scanner un ticket
        </Link>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/api/auth/signout")}
            className="text-gray-500 hover:text-gray-700"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}