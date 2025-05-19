import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import ChannelSetPage from "./components/channel-sets/ChannelSetPage";
import CreditsPage from "./components/credits/CreditsPage";
import LoginPage from "./components/auth/LoginPage";
import ProfilePage from "./components/profile/ProfilePage";
import ChannelSetDetailsPage from "./components/channel-sets/ChannelSetDetailsPage";
import AuthGuard from "./components/auth/AuthGuard";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ChannelSetsProvider } from "./contexts/ChannelSetsContext";
import { CreditsProvider } from "./contexts/CreditsContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "./components/auth/LoadingScreen";
import { Toaster } from "./components/ui/toaster";
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <CreditsProvider>
          <ChannelSetsProvider>
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
                </Routes>
                {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
              </>
            </Suspense>
            <Toaster />
          </ChannelSetsProvider>
        </CreditsProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
