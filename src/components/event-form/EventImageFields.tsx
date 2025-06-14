
import React from 'react';
import { Upload } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface EventImageFieldsProps {
  control: Control<any>;
  imagePreview: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventImageFields: React.FC<EventImageFieldsProps> = ({ 
  control, 
  imagePreview, 
  onImageChange 
}) => {
  return (
    <div className="space-y-4">
      <FormLabel>Event Image</FormLabel>
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> event image
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input 
              id="image-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={onImageChange}
            />
          </label>
        </div>
        
        {imagePreview && (
          <div className="mt-4">
            <img 
              src={imagePreview} 
              alt="Event preview" 
              className="max-w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <FormField
          control={control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Or enter image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/event-image.jpg"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default EventImageFields;
