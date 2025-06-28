import React from "react";
import { RadioItem, ItemIndicator } from "@radix-ui/react-menubar";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const MenubarRadioItem = React.forwardRef<
    React.ElementRef<typeof RadioItem>,
    React.ComponentPropsWithoutRef<typeof RadioItem>
>(({ className, children, ...props }, ref) => (
    <RadioItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <ItemIndicator>
                <DotFilledIcon className="h-4 w-4 fill-current" />
            </ItemIndicator>
        </span>
        {children}
    </RadioItem>
));
MenubarRadioItem.displayName = "MenubarRadioItem";

export default MenubarRadioItem;
