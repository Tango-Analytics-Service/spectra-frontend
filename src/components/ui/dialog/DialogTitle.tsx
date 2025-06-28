import React from "react";
import { Title } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof Title>,
    React.ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => (
    <Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

export default DialogTitle;
