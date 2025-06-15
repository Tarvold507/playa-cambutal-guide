
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminHeaderProps {
  onRefresh: () => void;
}

const AdminHeader = ({ onRefresh }: AdminHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Data
      </Button>
    </div>
  );
};

export default AdminHeader;
