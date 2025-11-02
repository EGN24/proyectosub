import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/components/Layout";

// Páginas
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Index from "@/pages/Index";
import Upload from "@/pages/Upload";
import Clean from "@/pages/Clean";
import Train from "@/pages/Train";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas con Layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <Layout>
                    <Upload />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/clean"
              element={
                <PrivateRoute>
                  <Layout>
                    <Clean />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/train"
              element={
                <PrivateRoute>
                  <Layout>
                    <Train />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/results"
              element={
                <PrivateRoute>
                  <Layout>
                    <Results />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;