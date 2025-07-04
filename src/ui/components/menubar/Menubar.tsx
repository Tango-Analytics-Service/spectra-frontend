import React from "react";
import { Root } from "@radix-ui/react-menubar";
import { cn } from "@/lib/cn";

const Menubar = React.forwardRef<
    React.ElementRef<typeof Root>,
    React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
    <Root
        ref={ref}
        className={cn(
            "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
            className
        )}
        {...props}
    />
));
Menubar.displayName = "Menubar";

export default Menubar;
