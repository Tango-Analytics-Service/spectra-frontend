import React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Trigger, Icon } from "@radix-ui/react-select";
import { cn } from "@/lib/cn";

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof Trigger>,
    React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
    <Trigger
        ref={ref}
        className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className
        )}
        {...props}
    >
        {children}
        <Icon asChild>
            <CaretSortIcon className="h-4 w-4 opacity-50" />
        </Icon>
    </Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export default SelectTrigger;
