import React from "react";
import { Action } from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../button";

const AlertDialogAction = React.forwardRef<
    React.ElementRef<typeof Action>,
    React.ComponentPropsWithoutRef<typeof Action>
>(({ className, ...props }, ref) => (
    <Action
        ref={ref}
        className={cn(buttonVariants(), className)}
        {...props}
    />
));
AlertDialogAction.displayName = "AlertDialogAction";

export default AlertDialogAction;
