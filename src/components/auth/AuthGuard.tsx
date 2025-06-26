// src/components/auth/AuthGuard.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default AuthGuard;
