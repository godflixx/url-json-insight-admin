
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminSettings from '@/components/admin/AdminSettings';
import { AdminProvider } from '@/contexts/AdminContext';

const Settings: React.FC = () => {
  return (
    <AdminProvider>
      <AdminLayout>
        <AdminSettings />
      </AdminLayout>
    </AdminProvider>
  );
};

export default Settings;
