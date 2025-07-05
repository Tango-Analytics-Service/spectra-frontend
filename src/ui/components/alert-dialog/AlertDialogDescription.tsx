import React from "react";
import { Description } from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/cn";

const AlertDialogDescription = React.forwardRef<
    React.ElementRef<typeof Description>,
    React.ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
    <Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

export default AlertDialogDescription;
