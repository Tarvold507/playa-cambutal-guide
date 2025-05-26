
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface PendingEventsTabProps {
  pendingEvents: any[];
  onApprove: (id: string) => void;
  onEdit: (item: any) => void;
  onReject: (id: string) => void;
}

const PendingEventsTab = ({ pendingEvents, onApprove, onEdit, onReject }: PendingEventsTabProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {pendingEvents.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">{t('admin.noEvents')}</p>
          </CardContent>
        </Card>
      ) : (
        pendingEvents.map((event: any) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Submitted by: {event.profiles?.name || 'Unknown'} ({event.profiles?.email || 'No email'})
                  </p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Host:</strong> {event.host}</p>
                <p><strong>Description:</strong> {event.description}</p>
                {event.full_description && (
                  <p><strong>Full Description:</strong> {event.full_description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => onApprove(event.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t('admin.approve')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onEdit(event)}
                >
                  {t('admin.edit')}
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => onReject(event.id)}
                >
                  {t('admin.reject')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PendingEventsTab;
