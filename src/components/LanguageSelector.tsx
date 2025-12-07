import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

const languages = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[70px] sm:w-[100px] md:w-[140px] bg-primary/50 border-accent/20 text-primary-foreground hover:bg-primary/70 transition-colors">
        <div className="flex items-center gap-1 sm:gap-2">
          <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <SelectValue>
            <span className="flex items-center gap-1">
              <span className="text-sm sm:text-base">{currentLanguage.flag}</span>
              <span className="hidden md:inline text-xs sm:text-sm">{currentLanguage.code.toUpperCase()}</span>
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-card border-border z-[100]">
        {languages.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="cursor-pointer hover:bg-accent/10 focus:bg-accent/10"
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
