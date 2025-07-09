import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/auth/stores/useAuthStore";
import LoadingScreen from "./LoadingScreen";

export interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const loadStatus = useAuthStore(state => state.loadStatus);
    const initialize = useAuthStore(state => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (loadStatus === "pending") {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
