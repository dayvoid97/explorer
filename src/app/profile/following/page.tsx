"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../../lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  username: string;
  profilePicUrl?: string;
}

export default function FollowingPage() {
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFollowing = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await authFetch(`${API_BASE}/gurkha/profile/following`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch following");
        setFollowing(data.following || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch following");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, []);

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Following</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {following.length === 0 ? (
            <li className="py-4 text-center text-gray-500">Not following anyone yet.</li>
          ) : (
            following.map((user) => (
              <li
                key={user.username}
                className="flex items-center gap-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2"
                onClick={() => router.push(`/publicprofile/${user.username}`)}
              >
                {user.profilePicUrl ? (
                  <img
                    src={user.profilePicUrl}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-current">@{user.username}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
} 