import React from "react";
import { List } from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

const TabsList = React.forwardRef<
    React.ElementRef<typeof List>,
    React.ComponentPropsWithoutRef<typeof List>
>(({ className, ...props }, ref) => (
    <List
        ref={ref}
        className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

export default TabsList;
