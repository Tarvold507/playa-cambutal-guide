
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface CardsFieldsProps {
  contentData: any;
  updateContentData: (field: string, value: any) => void;
  onImageUpload: (file: File, field: string) => void;
  uploading: boolean;
}

const CardsFields = ({ contentData, updateContentData, onImageUpload, uploading }: CardsFieldsProps) => {
  const cards = contentData.cards || [];

  const addCard = () => {
    const newCard = {
      id: Date.now().toString(),
      title: '',
      description: '',
      imageSrc: '',
      link: '',
      category: ''
    };
    updateContentData('cards', [...cards, newCard]);
  };

  const updateCard = (index: number, field: string, value: string) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    updateContentData('cards', updatedCards);
  };

  const removeCard = (index: number) => {
    const updatedCards = cards.filter((_: any, i: number) => i !== index);
    updateContentData('cards', updatedCards);
  };

  const handleCardImageUpload = async (file: File, cardIndex: number) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const { url } = await response.json();
        updateCard(cardIndex, 'imageSrc', url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cards-title">Section Title</Label>
          <Input
            id="cards-title"
            value={contentData.title || ''}
            onChange={(e) => updateContentData('title', e.target.value)}
            placeholder="e.g., Explore Costa Rica"
          />
        </div>
        <div>
          <Label htmlFor="cards-description">Section Description</Label>
          <Input
            id="cards-description"
            value={contentData.description || ''}
            onChange={(e) => updateContentData('description', e.target.value)}
            placeholder="Brief description of the cards section"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">Cards</h4>
          <Button onClick={addCard} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Card
          </Button>
        </div>

        {cards.map((card: any, index: number) => (
          <Card key={card.id || index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <CardTitle className="text-base">Card {index + 1}</CardTitle>
                </div>
                <Button
                  onClick={() => removeCard(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={card.title || ''}
                    onChange={(e) => updateCard(index, 'title', e.target.value)}
                    placeholder="Card title"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={card.category || ''}
                    onChange={(e) => updateCard(index, 'category', e.target.value)}
                    placeholder="e.g., Stay, Eat, Do"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={card.description || ''}
                  onChange={(e) => updateCard(index, 'description', e.target.value)}
                  placeholder="Card description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Link</Label>
                  <Input
                    value={card.link || ''}
                    onChange={(e) => updateCard(index, 'link', e.target.value)}
                    placeholder="/stay, /eat, etc."
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={card.imageSrc || ''}
                      onChange={(e) => updateCard(index, 'imageSrc', e.target.value)}
                      placeholder="Image URL"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCardImageUpload(file, index);
                        }
                      }}
                      className="hidden"
                      id={`card-image-${index}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`card-image-${index}`)?.click()}
                      disabled={uploading}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              {card.imageSrc && (
                <div className="mt-2">
                  <img
                    src={card.imageSrc}
                    alt={card.title || 'Card image'}
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {cards.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No cards added yet.</p>
            <p className="text-sm mt-1">Click "Add Card" to create your first card.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsFields;
