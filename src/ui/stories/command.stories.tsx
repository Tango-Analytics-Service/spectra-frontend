// [build] library: 'shadcn'
import {
    CalendarIcon,
    EnvelopeClosedIcon,
    FaceIcon,
    GearIcon,
    PersonIcon,
    RocketIcon,
} from "@radix-ui/react-icons";

import Command from "@/ui/components/command/Command";
import CommandEmpty from "@/ui/components/command/CommandEmpty";
import CommandGroup from "@/ui/components/command/CommandGroup";
import CommandInput from "@/ui/components/command/CommandInput";
import CommandItem from "@/ui/components/command/CommandItem";
import CommandList from "@/ui/components/command/CommandList";
import CommandSeparator from "@/ui/components/command/CommandSeparator";
import CommandShortcut from "@/ui/components/command/CommandShortcut";

const meta = {
    title: "ui/Command",
    component: Command,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => {
        return (
            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Calendar</span>
                        </CommandItem>
                        <CommandItem>
                            <FaceIcon className="mr-2 h-4 w-4" />
                            <span>Search Emoji</span>
                        </CommandItem>
                        <CommandItem>
                            <RocketIcon className="mr-2 h-4 w-4" />
                            <span>Launch</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem>
                            <PersonIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
                            <span>Mail</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <GearIcon className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        );
    },
    args: {},
};
