import React from "react";
import { Viewport } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/cn";

const NavigationMenuViewport = React.forwardRef<
    React.ElementRef<typeof Viewport>,
    React.ComponentPropsWithoutRef<typeof Viewport>
>(({ className, ...props }, ref) => (
    <div className={cn("absolute left-0 top-full flex justify-center")}>
        <Viewport
            className={cn(
                "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
                className
            )}
            ref={ref}
            {...props}
        />
    </div>
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

export default NavigationMenuViewport;
