
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useTranslations, useCreateTranslation, useUpdateTranslation, useDeleteTranslation, Translation } from '@/hooks/useTranslations';
import TranslationAddForm from './translations/TranslationAddForm';
import TranslationCard from './translations/TranslationCard';

const TranslationsManagementTab = () => {
  const { data: translations = [], isLoading } = useTranslations();
  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation();
  const deleteTranslation = useDeleteTranslation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Translation>>({});
  const [newTranslation, setNewTranslation] = useState({
    translation_key: '',
    language: 'en' as 'en' | 'es',
    value: '',
    category: 'home',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Group translations by category and key
  const groupedTranslations = translations.reduce((acc, translation) => {
    const category = translation.category;
    if (!acc[category]) {
      acc[category] = {};
    }
    
    const key = translation.translation_key;
    if (!acc[category][key]) {
      acc[category][key] = {};
    }
    
    acc[category][key][translation.language] = translation;
    return acc;
  }, {} as Record<string, Record<string, Record<string, Translation>>>);

  const handleEdit = (translation: Translation) => {
    setEditingId(translation.id);
    setEditForm(translation);
  };

  const handleSave = async () => {
    if (editingId && editForm.value) {
      await updateTranslation.mutateAsync({
        id: editingId,
        updates: { value: editForm.value }
      });
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this translation?')) {
      await deleteTranslation.mutateAsync(id);
    }
  };

  const handleAddTranslation = async () => {
    if (newTranslation.translation_key && newTranslation.value) {
      await createTranslation.mutateAsync(newTranslation);
      setNewTranslation({
        translation_key: '',
        language: 'en',
        value: '',
        category: 'home',
      });
      setShowAddForm(false);
    }
  };

  const handleNewTranslationChange = (updates: Partial<typeof newTranslation>) => {
    setNewTranslation(prev => ({ ...prev, ...updates }));
  };

  const handleFormChange = (value: string) => {
    setEditForm(prev => ({ ...prev, value }));
  };

  if (isLoading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Translation Management</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Translation
        </Button>
      </div>

      {showAddForm && (
        <TranslationAddForm
          newTranslation={newTranslation}
          onTranslationChange={handleNewTranslationChange}
          onAdd={handleAddTranslation}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <Tabs defaultValue="home">
        <TabsList>
          {Object.keys(groupedTranslations).map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category} ({Object.keys(groupedTranslations[category]).length})
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedTranslations).map(([category, keys]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {Object.entries(keys).map(([key, languages]) => (
              <TranslationCard
                key={key}
                translationKey={key}
                category={category}
                languages={languages}
                editingId={editingId}
                editForm={editForm}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onFormChange={handleFormChange}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TranslationsManagementTab;
