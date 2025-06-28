import React from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
    <Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export default DropdownMenuSeparator;
