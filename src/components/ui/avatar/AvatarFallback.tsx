import React from "react";
import { Fallback } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof Fallback>,
    React.ComponentPropsWithoutRef<typeof Fallback>
>(({ className, ...props }, ref) => (
    <Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = "AvatarFallback";

export default AvatarFallback;

