import React from "react";
import { Title } from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/cn";

const AlertDialogTitle = React.forwardRef<
    React.ElementRef<typeof Title>,
    React.ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => (
    <Title
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
    />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

export default AlertDialogTitle;
