import React from "react";
import { List } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

const NavigationMenuList = React.forwardRef<
    React.ElementRef<typeof List>,
    React.ComponentPropsWithoutRef<typeof List>
>(({ className, ...props }, ref) => (
    <List
        ref={ref}
        className={cn(
            "group flex flex-1 list-none items-center justify-center space-x-1",
            className
        )}
        {...props}
    />
));
NavigationMenuList.displayName = "NavigationMenuList";

export default NavigationMenuList;
