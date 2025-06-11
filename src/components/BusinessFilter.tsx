
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BusinessFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const BusinessFilter = ({ selectedCategory, onCategoryChange }: BusinessFilterProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-full max-w-xs">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="surf">Surf</SelectItem>
            <SelectItem value="fitness">Fitness & Wellness</SelectItem>
            <SelectItem value="tours">Tours & Nature</SelectItem>
            <SelectItem value="fishing">Fishing</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BusinessFilter;
