"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function ThemeButton() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] =useState(false);

   useEffect(() => {
        const timeout = window.setTimeout(() => setMounted(true), 0);
        return () => window.clearTimeout(timeout);
    }, []);

    if (!mounted) {
        return <div className="h-6 w-11" />;
    }

    const currentTheme = theme === "system" ? resolvedTheme : theme;
    const isDark = currentTheme === "dark";

    return (
        <SwitchPrimitives.Root
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            className={cn(
                "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                isDark ? "bg-slate-950" : "bg-pink-500/50"
            )}
        >
            <SwitchPrimitives.Thumb
                className={cn(
                    "pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-pink-800 shadow-lg ring-0 transition-transform",
                    isDark ? "translate-x-5" : "translate-x-0"
                )}
            >
                {isDark ? (
                    <Moon className="h-3 w-3 text-white" />
                ) : (
                    <Sun className="h-3 w-3 text-pink-500" />
                )}
            </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
    );
}