import React from "react";
import { Cancel } from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../button";

const AlertDialogCancel = React.forwardRef<
    React.ElementRef<typeof Cancel>,
    React.ComponentPropsWithoutRef<typeof Cancel>
>(({ className, ...props }, ref) => (
    <Cancel
        ref={ref}
        className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-2 sm:mt-0",
            className
        )}
        {...props}
    />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export default AlertDialogCancel;
