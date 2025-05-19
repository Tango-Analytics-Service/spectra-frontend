import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CreditsPage from "./components/credits/CreditsPage";
import LoginPage from "./components/auth/LoginPage";
import ProfilePage from "./components/profile/ProfilePage";
import AuthGuard from "./components/auth/AuthGuard";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import LoadingScreen from "./components/auth/LoadingScreen";
import routes from "tempo-routes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <AuthGuard>
                  <MainLayout>
                    <Home />
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
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
