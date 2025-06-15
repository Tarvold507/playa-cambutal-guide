
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { Translation } from '@/hooks/useTranslations';

interface TranslationCardProps {
  translationKey: string;
  category: string;
  languages: Record<string, Translation>;
  editingId: string | null;
  editForm: Partial<Translation>;
  onEdit: (translation: Translation) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onFormChange: (value: string) => void;
}

const TranslationCard = ({
  translationKey,
  category,
  languages,
  editingId,
  editForm,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFormChange
}: TranslationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{translationKey}</CardTitle>
            <Badge variant="secondary" className="mt-1">{category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['en', 'es'].map(lang => {
            const translation = languages[lang];
            const isEditing = editingId === translation?.id;
            
            return (
              <div key={lang} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium">
                    {lang === 'en' ? 'English' : 'Spanish'}
                  </label>
                  {translation && !isEditing && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => onEdit(translation)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => onDelete(translation.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {translation ? (
                  isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editForm.value || ''}
                        onChange={(e) => onFormChange(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={onSave} size="sm">
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button onClick={onCancel} variant="outline" size="sm">
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded border min-h-[80px]">
                      {translation.value}
                    </div>
                  )
                ) : (
                  <div className="p-3 bg-gray-100 rounded border min-h-[80px] text-gray-500 italic">
                    No translation available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationCard;
