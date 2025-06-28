import React from "react";
import { Root, Viewport, Corner } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import ScrollBar from "./ScrollBar";

const ScrollArea = React.forwardRef<
    React.ElementRef<typeof Root>,
    React.ComponentPropsWithoutRef<typeof Root>
>(({ className, children, ...props }, ref) => (
    <Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
    >
        <Viewport className="h-full w-full rounded-[inherit]">
            {children}
        </Viewport>
        <ScrollBar />
        <Corner />
    </Root>
));
ScrollArea.displayName = "ScrollArea";

export default ScrollArea;
