import React from "react";
import { Description } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof Description>,
    React.ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
    <Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

export default DialogDescription;
