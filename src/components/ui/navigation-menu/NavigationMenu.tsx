import React from "react";
import { Root } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import NavigationMenuViewport from "./NavigationMenuViewport";

const NavigationMenu = React.forwardRef<
    React.ElementRef<typeof Root>,
    React.ComponentPropsWithoutRef<typeof Root>
>(({ className, children, ...props }, ref) => (
    <Root
        ref={ref}
        className={cn(
            "relative z-10 flex max-w-max flex-1 items-center justify-center",
            className
        )}
        {...props}
    >
        {children}
        <NavigationMenuViewport />
    </Root>
));
NavigationMenu.displayName = "NavigationMenu";

export default NavigationMenu;

