// [build] library: 'shadcn'
import {
    CalendarIcon,
    EnvelopeClosedIcon,
    FaceIcon,
    GearIcon,
    PersonIcon,
    RocketIcon,
} from "@radix-ui/react-icons";

import Command from "@/components/ui/command/Command";
import CommandEmpty from "@/components/ui/command/CommandEmpty";
import CommandGroup from "@/components/ui/command/CommandGroup";
import CommandInput from "@/components/ui/command/CommandInput";
import CommandItem from "@/components/ui/command/CommandItem";
import CommandList from "@/components/ui/command/CommandList";
import CommandSeparator from "@/components/ui/command/CommandSeparator";
import CommandShortcut from "@/components/ui/command/CommandShortcut";

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
