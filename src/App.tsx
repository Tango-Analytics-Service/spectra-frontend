import { Suspense } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import ChannelsSetsPage from "@/pages/ChannelsSetsPage";
import ChannelSetDetailsPage from "@/pages/ChannelsSetDetailsPage";
import SearchesPage from "@/pages/SearchesPage";
import SearchDetailsPage from "@/pages/SearchDetailsPage"; // Make sure to create this page
import CreditsPage from "@/pages/CreditsPage";
import LoginPage from "@/pages/LoginPage";
import AnalysisTasksPage from "@/pages/AnalysisTasksPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthGuard from "@/auth/components/AuthGuard";
import LoadingScreen from "@/auth/components/LoadingScreen";
import { TooltipProvider } from "@/ui/components/tooltip";
import { Toaster } from "@/ui/components/toaster";
import MainLayout from "@/components/layout/MainLayout";
import tempoRoutes from "tempo-routes";

// Define the main application routes as an array of objects
const mainRoutes: RouteObject[] = [
    {
        path: "/",
        element: (
            <AuthGuard>
                <MainLayout hideHeader>
                    <ChannelsSetsPage />
                </MainLayout>
            </AuthGuard>
        ),
    },
    { path: "/login", element: <LoginPage /> },
    {
        path: "/searches",
        element: (
            <AuthGuard>
                <MainLayout>
                    <SearchesPage />
                </MainLayout>
            </AuthGuard>
        ),
    },
    {
        path: "/searches/:sessionId",
        element: (
            <AuthGuard>
                <MainLayout>
                    <SearchDetailsPage />
                </MainLayout>
            </AuthGuard>
        ),
    },
    {
        path: "/credits",
        element: (
            <AuthGuard>
                <MainLayout>
                    <CreditsPage />
                </MainLayout>
            </AuthGuard>
        ),
    },
    {
        path: "/profile",
        element: (
            <AuthGuard>
                <MainLayout>
                    <ProfilePage />
                </MainLayout>
            </AuthGuard>
        ),
    },
    {
        path: "/channel-sets/:id",
        element: (
            <AuthGuard>
                <MainLayout>
                    <ChannelSetDetailsPage />
                </MainLayout>
            </AuthGuard>
        ),
    },
    {
        path: "/analysis/tasks",
        element: (
            <AuthGuard>
                <MainLayout>
                    <AnalysisTasksPage />
                </MainLayout>
            </AuthGuard>
        ),
    },
];

export default function App() {
    // Combine routes if tempo is enabled
    const allRoutes = import.meta.env.VITE_TEMPO === "true" 
        ? [...mainRoutes, ...tempoRoutes] 
        : mainRoutes;

    // useRoutes hook will render the correct component for the current URL
    const element = useRoutes(allRoutes);

    return (
        <TooltipProvider>
            <Suspense fallback={<LoadingScreen />}>
                {element}
            </Suspense>
            <Toaster />
        </TooltipProvider>
    );
}