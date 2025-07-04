import React from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/cn";

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof Drawer.Title>,
    React.ComponentPropsWithoutRef<typeof Drawer.Title>
>(({ className, ...props }, ref) => (
    <Drawer.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DrawerTitle.displayName = "DrawerTitle";

export default DrawerTitle;
