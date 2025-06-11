
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface PendingAdventureBusinessesTabProps {
  pendingAdventureBusinesses: any[];
  onApprove: (id: string) => void;
  onEdit: (item: any) => void;
  onReject: (id: string) => void;
}

const PendingAdventureBusinessesTab = ({ 
  pendingAdventureBusinesses, 
  onApprove, 
  onEdit, 
  onReject 
}: PendingAdventureBusinessesTabProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {pendingAdventureBusinesses.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No pending adventure businesses to review.</p>
          </CardContent>
        </Card>
      ) : (
        pendingAdventureBusinesses.map((business: any) => (
          <Card key={business.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{business.business_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Submitted by: {business.profiles?.name || 'Unknown'} ({business.profiles?.email || 'No email'})
                  </p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p><strong>Category:</strong> {business.category}</p>
                <p><strong>Business Type:</strong> {business.business_type}</p>
                <p><strong>Location:</strong> {business.location}</p>
                <p><strong>Hours:</strong> {business.hours || 'N/A'}</p>
                <p><strong>WhatsApp:</strong> {business.whatsapp || 'N/A'}</p>
                <p><strong>Description:</strong> {business.description}</p>
                <p><strong>Created:</strong> {new Date(business.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => onApprove(business.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t('admin.approve')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onEdit(business)}
                >
                  {t('admin.edit')}
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => onReject(business.id)}
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

export default PendingAdventureBusinessesTab;
