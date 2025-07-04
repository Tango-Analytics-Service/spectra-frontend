import React from "react";
import { Description } from "@radix-ui/react-toast";
import { cn } from "@/lib/cn";

const ToastDescription = React.forwardRef<
    React.ElementRef<typeof Description>,
    React.ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
    <Description
        ref={ref}
        className={cn("text-sm opacity-90", className)}
        {...props}
    />
));
ToastDescription.displayName = "ToastDescription";

export default ToastDescription;
