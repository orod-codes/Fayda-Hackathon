# Language System Documentation

## Overview

The Hakim AI Health Assistant implements a comprehensive multilingual system supporting English, Amharic (አማርኛ), and Afaan Oromo. This system ensures that all user-facing text throughout the application is properly translated and accessible to users in their preferred language.

## Supported Languages

- **English (en)**: Primary language for international users
- **Amharic (am)**: አማርኛ - Primary language of Ethiopia
- **Afaan Oromo (or)**: Oromo language - Widely spoken in Ethiopia

## Architecture

### LanguageContext (`contexts/LanguageContext.tsx`)

The core of the language system is the `LanguageContext` which provides:

- **Language State Management**: Tracks the current language selection
- **Translation Lookup**: Provides access to translated text via the `translations` object
- **Language Switching**: Allows dynamic language changes throughout the app

### Key Components

1. **LanguageProvider**: Wraps the application and provides language context
2. **useLanguage Hook**: Provides access to language functionality in components
3. **LanguageSwitcher Component**: Reusable component for language selection

## Usage

### Basic Usage in Components

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { translations, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{translations.welcome}</h1>
      <p>{translations.healthAssistant}</p>
    </div>
  );
}
```

### Language Switcher Component

The `LanguageSwitcher` component provides three variants:

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Default variant (dropdown select)
<LanguageSwitcher variant="default" />

// Compact variant (minimal UI)
<LanguageSwitcher variant="compact" />

// Dropdown variant (custom dropdown)
<LanguageSwitcher variant="dropdown" />
```

## Translation Categories

The translation system is organized into logical categories:

### Main Navigation and Common Elements
- Welcome messages
- Navigation buttons (Back, Next, Cancel, Save, etc.)
- Status indicators (Loading, Error, Success, etc.)

### Chat Interface
- Chat-related text (Send, Type message, etc.)
- AI assistant responses
- Emergency alerts and notifications

### Patient Login and Registration
- Registration steps and forms
- Password creation and validation
- Fayda ID integration messages

### Dashboard Elements
- Dashboard navigation and sections
- User profile and settings
- Medical history and appointments

### Form Elements
- Form labels and placeholders
- Validation messages
- Submit and reset buttons

### Status and Messages
- Connection status
- Error messages
- Loading states

### Emergency and Health
- Emergency alerts
- Health status indicators
- Medical terminology

## Adding New Translations

### 1. Add Translation Keys

Add new translation keys to the `translations` object in `contexts/LanguageContext.tsx`:

```tsx
const translations = {
  en: {
    // ... existing translations
    newTranslationKey: "English text",
  },
  am: {
    // ... existing translations
    newTranslationKey: "አማርኛ ጽሑፍ",
  },
  or: {
    // ... existing translations
    newTranslationKey: "Oromo text",
  },
};
```

### 2. Use in Components

```tsx
const { translations } = useLanguage();

return <div>{translations.newTranslationKey}</div>;
```

## Best Practices

### 1. Consistent Naming
- Use descriptive, camelCase keys
- Group related translations together
- Use consistent terminology across languages

### 2. Context-Aware Translations
- Consider cultural context when translating
- Ensure medical terminology is accurate
- Test translations with native speakers

### 3. Dynamic Content
- For dynamic content, use template strings or interpolation
- Consider pluralization rules for different languages

### 4. Accessibility
- Ensure translations maintain accessibility features
- Consider text length differences between languages
- Test UI layout with different language content

## Implementation Examples

### Patient Login Page
The patient login page demonstrates comprehensive language usage:

```tsx
// Using translations for all text elements
<CardTitle>{translations.patientLogin}</CardTitle>
<CardDescription>{translations.completeRegistration}</CardDescription>
<Label>{translations.createPassword}</Label>
<Button>{translations.getStarted}</Button>
```

### Chat Interface
The chat interface uses translations for:

- Chat messages and responses
- Emergency alerts
- Quick actions and sidebar elements
- Status indicators

### Main Homepage
The homepage uses translations for:

- Welcome messages
- Role descriptions
- Important notices
- Navigation elements

## Language Persistence

The language selection is currently stored in component state. For production, consider:

1. **Local Storage**: Persist language preference
2. **User Preferences**: Store in user profile
3. **Browser Detection**: Auto-detect preferred language
4. **Geographic Detection**: Default based on location

## Future Enhancements

### Planned Features
1. **RTL Support**: Right-to-left language support
2. **Number Formatting**: Locale-specific number formatting
3. **Date/Time Formatting**: Locale-specific date/time display
4. **Currency Formatting**: Locale-specific currency display
5. **Pluralization**: Proper pluralization rules for each language

### Additional Languages
Consider adding support for:
- Tigrinya (ትግርኛ)
- Somali (Af-Soomaali)
- Other regional languages

## Testing

### Manual Testing
1. Switch between languages using the LanguageSwitcher
2. Verify all text elements update correctly
3. Test with different content lengths
4. Check UI layout with different languages

### Automated Testing
```tsx
// Example test for language switching
test('language switching updates translations', () => {
  const { result } = renderHook(() => useLanguage());
  
  act(() => {
    result.current.setLanguage('am');
  });
  
  expect(result.current.translations.welcome).toBe('ወደ ሃክሚን እንኳን በደህና መጡ');
});
```

## Troubleshooting

### Common Issues

1. **Missing Translations**: Ensure all languages have the same keys
2. **Layout Issues**: Test with longer text in different languages
3. **Character Encoding**: Ensure proper UTF-8 encoding for non-Latin scripts
4. **Font Support**: Use fonts that support all required characters

### Debugging

```tsx
// Debug current language and translations
const { language, translations } = useLanguage();
console.log('Current language:', language);
console.log('Available translations:', Object.keys(translations));
```

## Contributing

When adding new features:

1. **Add Translations First**: Add all required translations before implementing UI
2. **Test All Languages**: Verify functionality in all supported languages
3. **Consider Cultural Context**: Ensure translations are culturally appropriate
4. **Document Changes**: Update this documentation when adding new translation categories

## Resources

- [Amharic Language Resources](https://en.wikipedia.org/wiki/Amharic)
- [Oromo Language Resources](https://en.wikipedia.org/wiki/Oromo_language)
- [Internationalization Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Intl)
- [Unicode Support](https://unicode.org/) 