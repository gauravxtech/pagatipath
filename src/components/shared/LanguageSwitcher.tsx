import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
        { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    ];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-2 cursor-pointer ${i18n.language === lang.code ? 'bg-accent/10 text-accent' : ''
                            }`}
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};