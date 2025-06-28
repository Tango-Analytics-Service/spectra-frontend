import React from "react";
import { Overlay } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof Overlay>,
    React.ComponentPropsWithoutRef<typeof Overlay>
>(({ className, ...props }, ref) => (
    <Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 backdrop-blur-sm bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = "DialogOverlay";

export default DialogOverlay;
