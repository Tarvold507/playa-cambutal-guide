
import type { EditFormData } from '@/hooks/admin/types';

export const getDialogTitle = (editForm: EditFormData): string => {
  switch (editForm.type) {
    case 'event':
      return 'Edit Event';
    case 'business':
      return 'Edit Business Listing';
    case 'restaurant':
      return 'Edit Restaurant Listing';
    case 'hotel':
      return 'Edit Hotel Listing';
    default:
      return 'Edit Item';
  }
};
