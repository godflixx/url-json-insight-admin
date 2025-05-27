
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ToolsList from "./pages/admin/ToolsList";
import ToolForm from "./pages/admin/ToolForm";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected admin routes - redirect /admin to /admin/tools */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Navigate to="/admin/tools" replace />
            </ProtectedRoute>
          } />
          <Route path="/admin/tools" element={
            <ProtectedRoute>
              <ToolsList />
            </ProtectedRoute>
          } />
          <Route path="/admin/tools/new" element={
            <ProtectedRoute>
              <ToolForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/tools/edit/:id" element={
            <ProtectedRoute>
              <ToolForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
