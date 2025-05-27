
import { useAdminStatus } from './admin/useAdminStatus';
import { useAdminData } from './admin/useAdminData';
import { useAdminItemActions } from './admin/useAdminActions';
import { useAdminEdit } from './admin/useAdminEdit';
import type { TableType, ItemType } from './admin/types';

export const useAdminActions = () => {
  const { checkAdminStatus } = useAdminStatus();
  const {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    fetchPendingItems,
  } = useAdminData();
  const { handleApprove: baseHandleApprove, handleReject: baseHandleReject } = useAdminItemActions();
  const {
    selectedItem,
    isEditing,
    editForm,
    handleEdit,
    handleSaveEdit: baseHandleSaveEdit,
    handleFormChange,
    closeEditDialog,
  } = useAdminEdit();

  // Wrapper functions to include the refresh callback
  const handleApprove = (type: TableType, id: string) => {
    return baseHandleApprove(type, id, fetchPendingItems);
  };

  const handleReject = (type: TableType, id: string) => {
    return baseHandleReject(type, id, fetchPendingItems);
  };

  const handleSaveEdit = () => {
    return baseHandleSaveEdit(fetchPendingItems);
  };

  return {
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    selectedItem,
    isEditing,
    editForm,
    checkAdminStatus,
    fetchPendingItems,
    handleApprove,
    handleReject,
    handleEdit,
    handleSaveEdit,
    handleFormChange,
    closeEditDialog,
  };
};

export type { EditFormData } from './admin/types';
