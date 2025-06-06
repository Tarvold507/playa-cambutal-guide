
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserListingCardProps {
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'event' | 'restaurant' | 'business' | 'hotel';
  onEdit?: () => void;
  onDelete: () => void;
  image?: string;
  address?: string;
  location?: string;
  createdAt: string;
}

const UserListingCard = ({
  title,
  description,
  status,
  type,
  onEdit,
  onDelete,
  image,
  address,
  location,
  createdAt,
}: UserListingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'Event';
      case 'restaurant':
        return 'Restaurant';
      case 'business':
        return 'Business';
      case 'hotel':
        return 'Hotel';
      default:
        return 'Listing';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{getTypeLabel(type)}</Badge>
              <Badge className={getStatusColor(status)}>{status}</Badge>
            </div>
          </div>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-16 h-16 object-cover rounded-md ml-4"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}
        {(address || location) && (
          <p className="text-sm text-gray-500 mb-3">{address || location}</p>
        )}
        <p className="text-xs text-gray-400 mb-4">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
        
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {getTypeLabel(type)}</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserListingCard;
