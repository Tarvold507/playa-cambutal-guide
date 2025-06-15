
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewTranslation {
  translation_key: string;
  language: 'en' | 'es';
  value: string;
  category: string;
}

interface TranslationAddFormProps {
  newTranslation: NewTranslation;
  onTranslationChange: (updates: Partial<NewTranslation>) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const TranslationAddForm = ({ 
  newTranslation, 
  onTranslationChange, 
  onAdd, 
  onCancel 
}: TranslationAddFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Translation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Translation Key</label>
            <Input
              value={newTranslation.translation_key}
              onChange={(e) => onTranslationChange({ translation_key: e.target.value })}
              placeholder="e.g. home.explore.title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              value={newTranslation.category}
              onChange={(e) => onTranslationChange({ category: e.target.value })}
              placeholder="e.g. home"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={newTranslation.language}
              onChange={(e) => onTranslationChange({ language: e.target.value as 'en' | 'es' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Value</label>
          <Textarea
            value={newTranslation.value}
            onChange={(e) => onTranslationChange({ value: e.target.value })}
            placeholder="Translation value"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={onAdd}>Add Translation</Button>
          <Button onClick={onCancel} variant="outline">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationAddForm;
