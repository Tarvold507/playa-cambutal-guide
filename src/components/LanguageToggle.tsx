
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const toggleLanguage = (lang: 'en' | 'es') => {
    setLanguage(lang);
    // Store language preference in localStorage
    localStorage.setItem('language', lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{language === 'en' ? 'EN' : 'ES'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleLanguage('es')}>
          Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
