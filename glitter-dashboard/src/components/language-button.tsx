"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, Check } from "lucide-react";
import Flag from "react-world-flags";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export const LanguageButton = () => {

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const languages = [
    {
      label: "Khmer",
      code: "km",
      countryCode: "KH",
      localName: "ភាសាខ្មែរ"
    },
    {
      label: "English",
      code: "en",
      countryCode: "US",
      localName: "English"
    }
  ];

  const handleChangeLang = (lang: string) => {
    const newPath = `/${lang}${pathname.replace(/^\/(en|km)/, "")}`;
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-neutral-200 dark:border-neutral-800">
          <Languages className="size-4 text-neutral-600 dark:text-neutral-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 p-1">
        <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase">
          Select Language
        </div>
        <DropdownMenuSeparator />

        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center justify-between cursor-pointer py-2 px-3 focus:bg-pink-50 dark:focus:bg-pink-700/20"
            onClick={() => handleChangeLang(lang.code)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 verflow-hidden rounded-full border border-neutral-100 dark:border-neutral-800">
                <Flag code={lang.countryCode} className="object-cover w-full h-full rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lang.localName}</span>
                <span className="text-[10px] text-neutral-500">{lang.label}</span>
              </div>
            </div>
            {currentLocale === lang.code && (
              <Check className="size-4 text-pink-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};