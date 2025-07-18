// [build] library: 'shadcn'
import { ContextMenu, ContextMenuRadioGroup, ContextMenuSub, ContextMenuTrigger } from "@/ui/components/context-menu";
import ContextMenuCheckboxItem from "@/ui/components/context-menu/ContextMenuCheckboxItem";
import ContextMenuContent from "@/ui/components/context-menu/ContextMenuSubContent";
import ContextMenuItem from "@/ui/components/context-menu/ContextMenuItem";
import ContextMenuLabel from "@/ui/components/context-menu/ContextMenuLabel";
import ContextMenuRadioItem from "@/ui/components/context-menu/ContextMenuRadioItem";
import ContextMenuSeparator from "@/ui/components/context-menu/ContextMenuSeparator";
import ContextMenuShortcut from "@/ui/components/context-menu/ContextMenuShortcut";
import ContextMenuSubContent from "@/ui/components/context-menu/ContextMenuSubContent";
import ContextMenuSubTrigger from "@/ui/components/context-menu/ContextMenuSubTrigger";

const meta = {
    title: "ui/ContextMenu",
    component: ContextMenu,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed border-slate-200 text-sm dark:border-slate-700">
                Right click here
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuItem inset>
                    Back
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset disabled>
                    Forward
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset>
                    Reload
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem>
                            Save Page As...
                            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                        <ContextMenuItem>Name Window...</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem>Developer Tools</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>
                    Show Bookmarks Bar
                    <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
                </ContextMenuCheckboxItem>
                <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                <ContextMenuSeparator />
                <ContextMenuRadioGroup value="pedro">
                    <ContextMenuLabel inset>People</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuRadioItem value="pedro">
                        Pedro Duarte
                    </ContextMenuRadioItem>
                    <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
                </ContextMenuRadioGroup>
            </ContextMenuContent>
        </ContextMenu>
    ),
    args: {},
};
