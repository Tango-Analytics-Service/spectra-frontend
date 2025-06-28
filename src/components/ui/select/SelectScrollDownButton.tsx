import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ScrollDownButton } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof ScrollDownButton>
>(({ className, ...props }, ref) => (
    <ScrollDownButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className
        )}
        {...props}
    >
        <ChevronDownIcon />
    </ScrollDownButton>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export default SelectScrollDownButton;

