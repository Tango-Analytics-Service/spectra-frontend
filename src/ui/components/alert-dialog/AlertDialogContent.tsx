import React from "react";
import { Content, Portal } from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/cn";
import AlertDialogOverlay from "./AlertDialogOverlay";

const AlertDialogContent = React.forwardRef<
    React.ElementRef<typeof Content>,
    React.ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
    <Portal>
        <AlertDialogOverlay />
        <Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                className
            )}
            {...props}
        />
    </Portal>
));
AlertDialogContent.displayName = "AlertDialogContent";

export default AlertDialogContent;
