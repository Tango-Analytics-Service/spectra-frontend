import React from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/cn";

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof Drawer.Description>,
    React.ComponentPropsWithoutRef<typeof Drawer.Description>
>(({ className, ...props }, ref) => (
    <Drawer.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DrawerDescription.displayName = "DrawerDescription";

export default DrawerDescription;
