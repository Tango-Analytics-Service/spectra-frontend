import React from "react";
import { Description } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof Description>,
    React.ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
    <Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
SheetDescription.displayName = "SheetDescription";

export default SheetDescription;
