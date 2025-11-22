import { Route, Routes, Navigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Home from "./pages/Home.jsx";
import PageLoader from "./components/PageLoader.jsx";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layouts/AppLayout.jsx";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            !authUser ? <LoginPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/signup"
          element={
            !authUser ? <SignUpPage /> : <Navigate to="/" replace />
          }
        />

        {/* Protected layout */}
        <Route element={<AppLayout />}>
          {/* All routes inside here require auth and get header+sidebar */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
          {/* <Route path="/tasks" element={<TasksPage />} /> */}
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
