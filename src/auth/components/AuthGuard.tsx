import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/auth/stores/useAuthStore";
import LoadingScreen from "./LoadingScreen";

export interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const isLoaded = useAuthStore(state => state.isLoaded);
    const initialize = useAuthStore(state => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!isLoaded) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
