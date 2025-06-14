
import React from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';

interface BusinessImageUploadProps {
  imagePreview: string | null;
  uploading: boolean;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const BusinessImageUpload: React.FC<BusinessImageUploadProps> = ({
  imagePreview,
  uploading,
  onImageSelect,
  onRemoveImage
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>Business Image</FormLabel>
      <div className="flex flex-col space-y-2">
        {imagePreview ? (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Business preview" 
              className="w-full h-48 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Upload a photo of your business</p>
            <Input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessImageUpload;
