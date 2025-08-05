'use client';

import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'dropdown';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, translations } = useLanguage();

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'am' as Language, name: 'አማርኛ', flag: '🇪🇹', nativeName: 'Amharic' },
    { code: 'or' as Language, name: 'Afaan Oromo', flag: '🇾🇪', nativeName: 'Oromo' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0 cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block text-left ${className}`}>
        <Button
          variant="outline"
          className="flex items-center space-x-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-200"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.flag} {currentLanguage?.nativeName}</span>
        </Button>
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                language === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {language === lang.code && (
                  <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-xl px-4 py-2 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
} 