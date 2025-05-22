
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ToolFormComponent from '@/components/admin/ToolForm';
import { AdminProvider } from '@/contexts/AdminContext';

const ToolForm: React.FC = () => {
  return (
    <AdminProvider>
      <AdminLayout>
        <ToolFormComponent />
      </AdminLayout>
    </AdminProvider>
  );
};

export default ToolForm;
