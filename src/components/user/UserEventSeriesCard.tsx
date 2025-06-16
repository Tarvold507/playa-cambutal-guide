
import React from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, User, Edit, Trash2, Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventSeries, useRecurrencePattern } from '@/hooks/useEventSeries';
import { formatDaysOfWeek } from '@/utils/dateUtils';

interface UserEventSeriesCardProps {
  series: EventSeries;
  onEdit: (series: EventSeries) => void;
  onDelete: (seriesId: string) => void;
}

const UserEventSeriesCard: React.FC<UserEventSeriesCardProps> = ({ series, onEdit, onDelete }) => {
  const { data: pattern } = useRecurrencePattern(series.id);

  const handleEdit = () => {
    onEdit(series);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entire event series? This will remove all recurring instances.')) {
      onDelete(series.id);
    }
  };

  const getRecurrenceDescription = () => {
    if (!pattern) return 'Loading pattern...';

    let description = `Every ${pattern.interval_value} ${pattern.pattern_type}`;
    
    if (pattern.pattern_type === 'weekly' && pattern.days_of_week && pattern.days_of_week.length > 0) {
      description += ` on ${formatDaysOfWeek(pattern.days_of_week)}`;
    }
    
    if (pattern.pattern_type === 'monthly' && pattern.day_of_month) {
      description += ` on the ${pattern.day_of_month}${getOrdinalSuffix(pattern.day_of_month)}`;
    }

    if (pattern.end_type === 'after_count' && pattern.end_count) {
      description += ` for ${pattern.end_count} occurrences`;
    } else if (pattern.end_type === 'by_date' && pattern.end_date) {
      description += ` until ${format(new Date(pattern.end_date), 'MMM d, yyyy')}`;
    }

    return description;
  };

  const getOrdinalSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{series.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Repeat className="w-4 h-4" />
              <span>{getRecurrenceDescription()}</span>
            </div>
            <div className="text-sm text-gray-500">
              Created {format(new Date(series.created_at), 'MMM d, yyyy')}
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            Series
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{series.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{series.host}</span>
          </div>

          {series.description && (
            <p className="text-sm text-gray-700 line-clamp-2">
              {series.description}
            </p>
          )}

          {series.image_url && (
            <div className="rounded-md overflow-hidden">
              <img 
                src={series.image_url} 
                alt={series.title}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Series
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Series
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserEventSeriesCard;
