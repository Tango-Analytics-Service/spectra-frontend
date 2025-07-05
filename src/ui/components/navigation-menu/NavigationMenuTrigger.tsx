import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Trigger } from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/cn";
import { navigationMenuTriggerStyle } from ".";

const NavigationMenuTrigger = React.forwardRef<
    React.ElementRef<typeof Trigger>,
    React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
    <Trigger
        ref={ref}
        className={cn(navigationMenuTriggerStyle(), "group", className)}
        {...props}
    >
        {children}{" "}
        <ChevronDownIcon
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
            aria-hidden="true"
        />
    </Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export default NavigationMenuTrigger;
