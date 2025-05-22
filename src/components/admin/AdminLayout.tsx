
import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-agent-background text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-agent-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-agent-secondary/5 rounded-full blur-3xl -z-10" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
