// src/components/auth/AuthGuard.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
