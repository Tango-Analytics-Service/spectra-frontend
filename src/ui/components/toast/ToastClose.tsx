import React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Close } from "@radix-ui/react-toast";
import { cn } from "@/lib/cn";

const ToastClose = React.forwardRef<
    React.ElementRef<typeof Close>,
    React.ComponentPropsWithoutRef<typeof Close>
>(({ className, ...props }, ref) => (
    <Close
        ref={ref}
        className={cn(
            "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
            className
        )}
        toast-close=""
        {...props}
    >
        <Cross2Icon className="h-4 w-4" />
    </Close>
));
ToastClose.displayName = "ToastClose";

export default ToastClose;
