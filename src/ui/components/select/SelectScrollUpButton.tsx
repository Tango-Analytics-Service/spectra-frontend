import React from "react";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import { ScrollUpButton } from "@radix-ui/react-select";
import { cn } from "@/lib/cn";

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof ScrollUpButton>
>(({ className, ...props }, ref) => (
    <ScrollUpButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className
        )}
        {...props}
    >
        <ChevronUpIcon />
    </ScrollUpButton>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export default SelectScrollUpButton;

