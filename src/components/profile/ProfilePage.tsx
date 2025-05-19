// src/components/profile/ProfilePage.tsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="px-4 sm:px-6 pt-4 pb-4">
      <h1 className="text-xl sm:text-2xl font-semibold text-white mb-4">
        Профиль
      </h1>

      {user && (
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-4">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.first_name}
                className="w-16 h-16 rounded-full mr-4"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-xl font-semibold mr-4">
                {user.first_name.charAt(0)}
              </div>
            )}

            <div>
              <h2 className="text-lg font-medium">
                {user.first_name} {user.last_name}
              </h2>
              {user.username && (
                <p className="text-blue-300">@{user.username}</p>
              )}
              {user.is_premium && (
                <span className="inline-block mt-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                  Premium
                </span>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={logout}
          >
            Выйти из аккаунта
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-300 mb-2">
            Настройки приложения
          </h3>
          <p className="text-sm text-slate-400">
            Настройки приложения будут доступны в ближайшее время
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-300 mb-2">
            О приложении
          </h3>
          <p className="text-sm text-slate-400">
            SPECTRA beta - Аналитика и управление телеграм-каналами
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
