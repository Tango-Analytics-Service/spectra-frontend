import React from "react";
import { Label } from "@radix-ui/react-context-menu";
import { cn } from "@/lib/cn";

const ContextMenuLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <Label
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold text-foreground",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

export default ContextMenuLabel;

