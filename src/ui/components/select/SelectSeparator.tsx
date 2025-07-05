import React from "react";
import { Separator } from "@radix-ui/react-select";
import { cn } from "@/lib/cn";

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
    <Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
SelectSeparator.displayName = "SelectSeparator";

export default SelectSeparator;
