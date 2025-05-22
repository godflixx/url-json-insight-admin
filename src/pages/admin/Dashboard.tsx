
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardOverview from '@/components/admin/DashboardOverview';
import { AdminProvider } from '@/contexts/AdminContext';

const Dashboard: React.FC = () => {
  return (
    <AdminProvider>
      <AdminLayout>
        <DashboardOverview />
      </AdminLayout>
    </AdminProvider>
  );
};

export default Dashboard;
