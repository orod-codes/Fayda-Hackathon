import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Test component to access language context
function TestComponent() {
  const { translations, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <div data-testid="welcome">{translations.welcome}</div>
      <div data-testid="language">{language}</div>
      <button onClick={() => setLanguage('am')} data-testid="switch-to-amharic">
        Switch to Amharic
      </button>
      <button onClick={() => setLanguage('or')} data-testid="switch-to-oromo">
        Switch to Oromo
      </button>
      <button onClick={() => setLanguage('en')} data-testid="switch-to-english">
        Switch to English
      </button>
    </div>
  );
}

// Wrapper component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe('Language System', () => {
  test('renders with default English language', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome to Hakim AI ');
  });

  test('switches to Amharic language', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('switch-to-amharic'));
    
    expect(screen.getByTestId('language')).toHaveTextContent('am');
    expect(screen.getByTestId('welcome')).toHaveTextContent('ወደ ሃክሚን እንኳን በደህና መጡ');
  });

  test('switches to Oromo language', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('switch-to-oromo'));
    
    expect(screen.getByTestId('language')).toHaveTextContent('or');
    expect(screen.getByTestId('welcome')).toHaveTextContent('Gara hakim-ai Baga Nagaan Dhuftan');
  });

  test('switches back to English language', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Switch to Amharic first
    fireEvent.click(screen.getByTestId('switch-to-amharic'));
    expect(screen.getByTestId('language')).toHaveTextContent('am');

    // Switch back to English
    fireEvent.click(screen.getByTestId('switch-to-english'));
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome to Hakim AI ');
  });

  test('LanguageSwitcher component renders correctly', () => {
    render(
      <TestWrapper>
        <LanguageSwitcher variant="default" />
      </TestWrapper>
    );

    // Check that the language switcher is rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('translations are available for all categories', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const { translations } = useLanguage();
    
    // Test that key translation categories exist
    expect(translations).toHaveProperty('welcome');
    expect(translations).toHaveProperty('healthAssistant');
    expect(translations).toHaveProperty('patientLogin');
    expect(translations).toHaveProperty('dashboard');
    expect(translations).toHaveProperty('emergency');
    expect(translations).toHaveProperty('back');
    expect(translations).toHaveProperty('send');
    expect(translations).toHaveProperty('loading');
  });

  test('all languages have the same translation keys', () => {
    // This test ensures consistency across languages
    const { translations: enTranslations } = useLanguage();
    const enKeys = Object.keys(enTranslations);

    // Switch to Amharic and check keys
    fireEvent.click(screen.getByTestId('switch-to-amharic'));
    const { translations: amTranslations } = useLanguage();
    const amKeys = Object.keys(amTranslations);

    // Switch to Oromo and check keys
    fireEvent.click(screen.getByTestId('switch-to-oromo'));
    const { translations: orTranslations } = useLanguage();
    const orKeys = Object.keys(orTranslations);

    // All languages should have the same keys
    expect(amKeys).toEqual(enKeys);
    expect(orKeys).toEqual(enKeys);
  });
}); 