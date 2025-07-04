import React from "react";
import { Item } from "@radix-ui/react-accordion";
import { cn } from "@/lib/cn";

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof Item>,
    React.ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
    <Item
        ref={ref}
        className={cn("border-b", className)}
        {...props}
    />
));
AccordionItem.displayName = "AccordionItem";

export default AccordionItem;
