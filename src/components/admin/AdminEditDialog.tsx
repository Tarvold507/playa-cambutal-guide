
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import EditFormRenderer from './EditFormRenderer';
import { getDialogTitle } from './utils/dialogUtils';
import type { EditFormData } from '@/hooks/admin/types';

interface AdminEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
  onSave: () => void;
}

const AdminEditDialog = ({ isOpen, onClose, editForm, onFormChange, onSave }: AdminEditDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {getDialogTitle(editForm)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <EditFormRenderer editForm={editForm} onFormChange={onFormChange} />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={onSave}>
              {t('common.save')} Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditDialog;
