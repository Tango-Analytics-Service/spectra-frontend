import React from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/cn";
import DrawerOverlay from "./DrawerOverlay";

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof Drawer.Content>,
    React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, children, ...props }, ref) => (
    <Drawer.Portal>
        <DrawerOverlay />
        <Drawer.Content
            ref={ref}
            className={cn(
                "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
                className
            )}
            {...props}
        >
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
            {children}
        </Drawer.Content>
    </Drawer.Portal>
));
DrawerContent.displayName = "DrawerContent";

export default DrawerContent;
