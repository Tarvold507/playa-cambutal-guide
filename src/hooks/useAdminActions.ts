
import { useAdminStatus } from './admin/useAdminStatus';
import { useAdminData } from './admin/useAdminData';
import { useAdminLiveData } from './admin/useAdminLiveData';
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
    pendingAdventureBusinesses,
    fetchPendingItems,
  } = useAdminData();
  const {
    liveEvents,
    liveBusinesses,
    liveRestaurants,
    liveHotels,
    fetchLiveItems,
  } = useAdminLiveData();
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

  // Refresh both pending and live data
  const refreshAllData = () => {
    fetchPendingItems();
    fetchLiveItems();
  };

  // Wrapper functions to include the refresh callback
  const handleApprove = (type: TableType, id: string) => {
    return baseHandleApprove(type, id, refreshAllData);
  };

  const handleReject = (type: TableType, id: string) => {
    return baseHandleReject(type, id, refreshAllData);
  };

  const handleSaveEdit = () => {
    return baseHandleSaveEdit(refreshAllData);
  };

  return {
    // Pending data
    pendingEvents,
    pendingBusinesses,
    pendingRestaurants,
    pendingHotels,
    pendingAdventureBusinesses,
    // Live data
    liveEvents,
    liveBusinesses,
    liveRestaurants,
    liveHotels,
    // Other state
    selectedItem,
    isEditing,
    editForm,
    // Actions
    checkAdminStatus,
    fetchPendingItems,
    fetchLiveItems,
    refreshAllData,
    handleApprove,
    handleReject,
    handleEdit,
    handleSaveEdit,
    handleFormChange,
    closeEditDialog,
  };
};

export type { EditFormData } from './admin/types';
