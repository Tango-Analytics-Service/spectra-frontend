import React from "react";
import { CheckboxItem, ItemIndicator } from "@radix-ui/react-menubar";
import { cn } from "@/lib/cn";
import { CheckIcon } from "@radix-ui/react-icons";

const MenubarCheckboxItem = React.forwardRef<
    React.ElementRef<typeof CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <CheckboxItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <ItemIndicator>
                <CheckIcon className="h-4 w-4" />
            </ItemIndicator>
        </span>
        {children}
    </CheckboxItem>
));
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

export default MenubarCheckboxItem;
