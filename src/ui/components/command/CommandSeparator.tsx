import React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/cn";

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 h-px bg-border", className)}
        {...props}
    />
));
CommandSeparator.displayName = "CommandSeparator";

export default CommandSeparator;
