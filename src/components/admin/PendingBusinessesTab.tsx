
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface PendingBusinessesTabProps {
  pendingBusinesses: any[];
  onApprove: (id: string) => void;
  onEdit: (item: any) => void;
  onReject: (id: string) => void;
}

const PendingBusinessesTab = ({ pendingBusinesses, onApprove, onEdit, onReject }: PendingBusinessesTabProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {pendingBusinesses.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">{t('admin.noBusinesses')}</p>
          </CardContent>
        </Card>
      ) : (
        pendingBusinesses.map((business: any) => (
          <Card key={business.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{business.name}</CardTitle>
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
                <p><strong>Address:</strong> {business.address}</p>
                <p><strong>Phone:</strong> {business.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {business.email || 'N/A'}</p>
                <p><strong>Website:</strong> {business.website || 'N/A'}</p>
                <p><strong>Description:</strong> {business.description}</p>
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

export default PendingBusinessesTab;
