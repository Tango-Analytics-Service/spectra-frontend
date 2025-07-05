import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { Item, Indicator } from "@radix-ui/react-radio-group";

import { cn } from "@/lib/cn";
const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof Item>,
    React.ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => {
    return (
        <Item
            ref={ref}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <Indicator className="flex items-center justify-center">
                <CheckIcon className="h-3.5 w-3.5 fill-primary" />
            </Indicator>
        </Item>
    );
});
RadioGroupItem.displayName = "RadioGroupItem";

export default RadioGroupItem;
