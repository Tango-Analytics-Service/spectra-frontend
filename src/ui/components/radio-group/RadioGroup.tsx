import React from "react";
import { Root } from "@radix-ui/react-radio-group";

import { cn } from "@/lib/cn";
const RadioGroup = React.forwardRef<
    React.ElementRef<typeof Root>,
    React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
    return (
        <Root
            className={cn("grid gap-2", className)}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
