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
    <header className="bg-primary/95 backdrop-blur-md text-white py-2 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-hero rounded-lg">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">PragatiPath</span>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs">
              <a href="tel:1800-XXX-XXXX" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span>1800-XXX-XXXX</span>
              </a>
              <a href="mailto:support@pragatipath.gov.in" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span>support@pragatipath.gov.in</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 text-xs">
                  <Languages className="h-3.5 w-3.5 mr-1.5" />
                  {languages.find(lang => lang.code === i18n.language)?.name || 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`cursor-pointer ${i18n.language === lang.code ? 'bg-accent/10' : ''}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:bg-white/10 h-8 px-2"
            >
              {theme === 'light' ? (
                <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
