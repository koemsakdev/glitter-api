"use client";

import { UserButton } from "@/components/user-button";
import { Separator } from "@/components/ui/separator";
import { ThemeButton } from "@/components/theme-button";
import { LanguageButton } from "./language-button";
export const NavbarRoute = () => {
    return (
        <div className={"flex h-5 items-center space-x-4 text-sm ml-auto"}>
            <LanguageButton />
            <Separator orientation="vertical" />
            <ThemeButton />
            <Separator orientation="vertical" />
            <UserButton />
        </div>
    )
}