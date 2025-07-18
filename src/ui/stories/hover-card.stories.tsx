// [build] library: 'shadcn'
import { CalendarDays } from "lucide-react";
import Avatar from "@/ui/components/avatar/Avatar";
import AvatarFallback from "@/ui/components/avatar/AvatarFallback";
import AvatarImage from "@/ui/components/avatar/AvatarImage";
import { Button } from "@/ui/components/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/ui/components/hover-card";

const meta = {
    title: "ui/HoverCard",
    component: HoverCard,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link">@nextjs</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/vercel.png" />
                        <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">@nextjs</h4>
                        <p className="text-sm">
                            The React Framework – created and maintained by @vercel.
                        </p>
                        <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Joined December 2021
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    ),
    args: {},
};
