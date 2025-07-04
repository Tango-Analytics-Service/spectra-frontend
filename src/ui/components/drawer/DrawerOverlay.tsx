import React from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/cn";

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof Drawer.Overlay>,
    React.ComponentPropsWithoutRef<typeof Drawer.Overlay>
>(({ className, ...props }, ref) => (
    <Drawer.Overlay
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-black/80", className)}
        {...props}
    />
));
DrawerOverlay.displayName = "DrawerOverlay";

export default DrawerOverlay;
