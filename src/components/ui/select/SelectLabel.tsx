import React from "react";
import { Label } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
    <Label
        ref={ref}
        className={cn("px-2 py-1.5 text-sm font-semibold", className)}
        {...props}
    />
));
SelectLabel.displayName = "SelectLabel";

export default SelectLabel;
