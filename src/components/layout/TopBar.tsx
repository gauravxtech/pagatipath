import { GraduationCap, Phone, Mail, Moon, Sun, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const TopBar = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { t, i18n } = useTranslation();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  return (
    <div className="bg-white dark:bg-card border-b border-gray-200 dark:border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-r from-accent to-orange-500 rounded-xl shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-foreground">PragatiPath</h1>
              <p className="text-sm text-gray-600 dark:text-muted-foreground hidden sm:block">{t('contact.nationalTrainingPortal')}</p>
            </div>
          </div>

          {/* Contact Info and Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-gray-700 dark:text-foreground text-sm">
                <Phone className="h-4 w-4 text-accent" />
                <span>{t('contact.phone')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-foreground text-sm">
                <Mail className="h-4 w-4 text-accent" />
                <span>{t('contact.email')}</span>
              </div>
            </div>

            {/* Vertical Button Stack */}
            <div className="flex flex-col gap-0.5">
              {/* Language Converter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
                  >
                    <Languages className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-card shadow-soft border border-gray-200 dark:border-border">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center gap-2 cursor-pointer ${i18n.language === lang.code
                        ? 'bg-accent/10 dark:bg-accent/20 text-accent'
                        : 'text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted'
                        }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
