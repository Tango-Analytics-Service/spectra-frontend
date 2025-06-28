import React from "react";
import { Separator } from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";

const MenubarSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
    <Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
MenubarSeparator.displayName = "MenubarSeparator";

export default MenubarSeparator;
