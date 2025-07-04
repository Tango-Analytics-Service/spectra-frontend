import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import ChannelsSetsPage from "@/channels-sets/pages/ChannelsSetsPage";
import ChannelSetDetailsPage from "@/channels-sets/pages/ChannelsSetDetailsPage";
import FiltersPage from "@/filters/pages/FiltersPage";
import CreditsPage from "@/credits/pages/CreditsPage";
import LoginPage from "@/auth/pages/LoginPage";
import AuthGuard from "@/auth/components/AuthGuard";
import LoadingScreen from "@/auth/components/LoadingScreen";
import AnalysisTasksPage from "@/analysis/pages/AnalysisTasksPage";
import { TooltipProvider } from "@/ui/components/tooltip";
import { Toaster } from "@/ui/components/toaster";
import ProfilePage from "./components/profile/ProfilePage";
import MainLayout from "./components/layout/MainLayout";
import tempoRoutes from "tempo-routes";

export default function App() {
    const routes = useRoutes(tempoRoutes);

    return (
        <TooltipProvider>
            <Suspense fallback={<LoadingScreen />}>
                <>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/"
                            element={
                                <AuthGuard>
                                    <MainLayout>
                                        <ChannelsSetsPage />
                                    </MainLayout>
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/filters"
                            element={
                                <AuthGuard>
                                    <MainLayout>
                                        <FiltersPage />
                                    </MainLayout>
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/credits"
                            element={
                                <AuthGuard>
                                    <MainLayout>
                                        <CreditsPage />
                                    </MainLayout>
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <AuthGuard>
                                    <MainLayout>
                                        <ProfilePage />
                                    </MainLayout>
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/channel-sets/:id"
                            element={
                                <AuthGuard>
                                    <MainLayout>
                                        <ChannelSetDetailsPage />
                                    </MainLayout>
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/analysis/tasks"
                            element={
                                <AuthGuard>
                                    <MainLayout>
                                        <AnalysisTasksPage />
                                    </MainLayout>
                                </AuthGuard>
                            }
                        />
                    </Routes>
                    {import.meta.env.VITE_TEMPO === "true" && routes}
                </>
            </Suspense>
            <Toaster />
        </TooltipProvider>
    );
}
