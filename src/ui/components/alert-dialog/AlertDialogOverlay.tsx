import React from "react";
import { Overlay } from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/cn";

const AlertDialogOverlay = React.forwardRef<
    React.ElementRef<typeof Overlay>,
    React.ComponentPropsWithoutRef<typeof Overlay>
>(({ className, ...props }, ref) => (
    <Overlay
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
        ref={ref}
    />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

export default AlertDialogOverlay;
