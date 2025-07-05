import React from "react";
import { Content, Portal } from "@radix-ui/react-menubar";
import { cn } from "@/lib/cn";

const MenubarContent = React.forwardRef<
    React.ElementRef<typeof Content>,
    React.ComponentPropsWithoutRef<typeof Content>
>(
    (
        { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
        ref
    ) => (
        <Portal>
            <Content
                ref={ref}
                align={align}
                alignOffset={alignOffset}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    className
                )}
                {...props}
            />
        </Portal>
    )
);
MenubarContent.displayName = "MenubarContent";

export default MenubarContent;
