
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ToolsListComponent from '@/components/admin/ToolsList';
import { AdminProvider } from '@/contexts/AdminContext';

const ToolsList: React.FC = () => {
  return (
    <AdminProvider>
      <AdminLayout>
        <ToolsListComponent />
      </AdminLayout>
    </AdminProvider>
  );
};

export default ToolsList;
