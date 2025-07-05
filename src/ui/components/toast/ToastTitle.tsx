import React from "react";
import { Title } from "@radix-ui/react-toast";
import { cn } from "@/lib/cn";

const ToastTitle = React.forwardRef<
    React.ElementRef<typeof Title>,
    React.ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => (
    <Title
        ref={ref}
        className={cn("text-sm font-semibold [&+div]:text-xs", className)}
        {...props}
    />
));
ToastTitle.displayName = "ToastTitle";

export default ToastTitle;
