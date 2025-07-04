import React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/cn";

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
        {...props}
    />
));
CommandList.displayName = "CommandList";

export default CommandList;
