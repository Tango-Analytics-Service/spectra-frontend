import React from "react";
import { Root } from "@radix-ui/react-avatar";
import { cn } from "@/lib/cn";

const Avatar = React.forwardRef<
    React.ElementRef<typeof Root>,
    React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
    <Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
));
Avatar.displayName = "Avatar";

export default Avatar;

