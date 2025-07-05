import React from "react";
import { Label } from "@radix-ui/react-menubar";
import { cn } from "@/lib/cn";

const MenubarLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <Label
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
MenubarLabel.displayName = "MenubarLabel";

export default MenubarLabel;
