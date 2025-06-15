
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { useTranslations, useCreateTranslation, useUpdateTranslation, useDeleteTranslation, Translation } from '@/hooks/useTranslations';

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
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, translation_key: e.target.value }))}
                  placeholder="e.g. home.explore.title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  value={newTranslation.category}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g. home"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={newTranslation.language}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, language: e.target.value as 'en' | 'es' }))}
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
                onChange={(e) => setNewTranslation(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Translation value"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTranslation}>Add Translation</Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
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
              <Card key={key}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{key}</CardTitle>
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
                                  onClick={() => handleEdit(translation)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(translation.id)}
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
                                  onChange={(e) => setEditForm(prev => ({ ...prev, value: e.target.value }))}
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <Button onClick={handleSave} size="sm">
                                    <Save className="w-3 h-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button onClick={handleCancel} variant="outline" size="sm">
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
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TranslationsManagementTab;
