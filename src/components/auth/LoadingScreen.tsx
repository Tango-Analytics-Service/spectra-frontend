// src/components/auth/LoadingScreen.tsx
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0F172A] to-[#131c2e] text-white">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-blue-300">Загрузка...</p>
    </div>
  );
};

export default LoadingScreen;
