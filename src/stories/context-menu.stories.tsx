// [build] library: 'shadcn'
import { ContextMenu, ContextMenuRadioGroup, ContextMenuSub, ContextMenuTrigger } from "@/components/ui/context-menu";
import ContextMenuCheckboxItem from "@/components/ui/context-menu/ContextMenuCheckboxItem";
import ContextMenuContent from "@/components/ui/context-menu/ContextMenuSubContent";
import ContextMenuItem from "@/components/ui/context-menu/ContextMenuItem";
import ContextMenuLabel from "@/components/ui/context-menu/ContextMenuLabel";
import ContextMenuRadioItem from "@/components/ui/context-menu/ContextMenuRadioItem";
import ContextMenuSeparator from "@/components/ui/context-menu/ContextMenuSeparator";
import ContextMenuShortcut from "@/components/ui/context-menu/ContextMenuShortcut";
import ContextMenuSubContent from "@/components/ui/context-menu/ContextMenuSubContent";
import ContextMenuSubTrigger from "@/components/ui/context-menu/ContextMenuSubTrigger";

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
