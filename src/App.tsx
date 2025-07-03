// src/App.tsx (с добавленным контекстом задач)
import { Suspense, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import ChannelSetPage from "./components/channel-sets/ChannelSetPage";
import FiltersPage from "./components/filters/FiltersPage";
import CreditsPage from "./components/credits/CreditsPage";
import LoginPage from "./components/auth/LoginPage";
import ProfilePage from "./components/profile/ProfilePage";
import ChannelSetDetailsPage from "./components/channel-sets/ChannelSetDetailsPage";
import AnalysisTasksPage from "./components/analysis/AnalysisTasksPage";
import AuthGuard from "./components/auth/AuthGuard";
import MainLayout from "./components/layout/MainLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "./components/auth/LoadingScreen";
import { Toaster } from "./components/ui/toaster";
import tempoRoutes from "tempo-routes";

function App() {
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
                                        <ChannelSetPage />
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

export default App;
