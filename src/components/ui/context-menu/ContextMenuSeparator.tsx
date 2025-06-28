import React from "react";
import { Separator } from "@radix-ui/react-context-menu";
import { cn } from "@/lib/utils";


const ContextMenuSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
    <Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-border", className)}
        {...props}
    />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export default ContextMenuSeparator;
