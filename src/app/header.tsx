'use client';

import { FontSizeControl } from "@/components/font-size-control";
import { ToggleTheme } from "@/components/toggle-theme";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const locale = useLocale();
  
  const t = useTranslations('header');

  const locales = [
    { value: 'pt', label: '🇧🇷 Português' },
    { value: 'en', label: '🇺🇸 English' },
  ];

  const updatePathname = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  const handleLocaleChange = (value: string) => {
    updatePathname(value);
  }

  return (
    <header className="z-50 flex gap-4 justify-center items-center self-center row-start-1 p-4 border-b border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div>
        <ToggleTheme.Root>
          <ToggleTheme.Icon />
        </ToggleTheme.Root>
      </div>
      <div>
        <Select 
          value={locale}
          onValueChange={handleLocaleChange}
        >
          <SelectTrigger className="w-[180px] text-sm text-black dark:text-white">
            <SelectValue placeholder={t('select.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('select.label')}</SelectLabel>
              {locales.map((locale) => (
                <SelectItem 
                  key={locale.value} 
                  value={locale.value}
                  className="text-sm text-black dark:text-white"
                >
                  {locale.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* <h1 className="text-center text-2xl/6 w-full text-black dark:text-white">
        Giulice.js
      </h1> */}
      <div>
        <FontSizeControl.Root>
          <FontSizeControl.Actions />
        </FontSizeControl.Root>
      </div>

      </header>
    )
  }