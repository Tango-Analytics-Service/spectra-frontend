import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "@/auth/api/hooks";

export interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { data, status } = useAuth();

    if (status === "pending") {
        return <LoadingScreen />;
    }

    if (data.token === undefined) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
