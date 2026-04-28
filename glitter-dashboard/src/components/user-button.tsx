import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export const UserButton = () => {
    const router = useRouter();
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={"hover:bg-transparent"}>
                <Avatar className={"cursor-pointer border border-pink-300 dark:border-pink-500"}>
                    {/* <AvatarImage src={session?.user.image} */}
                    <AvatarFallback className="text-xs mt-0.2">KM</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"} className="min-w-52 p-2">
                <div className="flex flex-col justify-center items-center gap-2 px-2.5 py-2">
                    <Avatar className="size-12 text-xl rounded-full border border-neutral-300">
                        {/* {
                            session?.user.image && (
                                <AvatarImage src={session?.user.image} />
                            )
                        } */}
                        <AvatarFallback className="text-sm mt-0.2">KM</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200"> Koemsak Mean </p>
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300"> koemsak.mean@gmail.com </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                    <Settings className="size-4 text-black dark:text-white" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="size-4 text-red-500" />
                    <span className="text-red-500">Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}