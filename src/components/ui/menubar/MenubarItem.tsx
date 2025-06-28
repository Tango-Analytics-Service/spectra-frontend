import React from "react";
import { Item } from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";

const MenubarItem = React.forwardRef<
    React.ElementRef<typeof Item>,
    React.ComponentPropsWithoutRef<typeof Item> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
MenubarItem.displayName = "MenubarItem";

export default MenubarItem;
