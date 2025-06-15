
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, MapPin, User, RotateCcw } from 'lucide-react';
import { EventSeries } from '@/hooks/useEventSeries';

interface UserEventSeriesCardProps {
  series: EventSeries;
  onEdit: (series: EventSeries) => void;
  onDelete: (seriesId: string) => void;
}

const UserEventSeriesCard: React.FC<UserEventSeriesCardProps> = ({
  series,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500" />
              {series.title}
            </CardTitle>
            <Badge variant="secondary" className="mt-1">
              Recurring Series
            </Badge>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              onClick={() => onEdit(series)}
              variant="outline"
              size="sm"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete(series.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{series.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Hosted by {series.host}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Created {new Date(series.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        {series.description && (
          <p className="text-sm text-gray-700 mt-3 line-clamp-2">
            {series.description}
          </p>
        )}

        {series.image_url && (
          <img 
            src={series.image_url} 
            alt={series.title}
            className="w-full h-32 object-cover rounded-md mt-3"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UserEventSeriesCard;
