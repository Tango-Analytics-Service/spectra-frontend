import React from "react";
import { SubTrigger } from "@radix-ui/react-context-menu";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";

const ContextMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof SubTrigger>,
    React.ComponentPropsWithoutRef<typeof SubTrigger> & {
        inset?: boolean
    }
>(({ className, inset, children, ...props }, ref) => (
    <SubTrigger
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            inset && "pl-8",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRightIcon className="ml-auto h-4 w-4" />
    </SubTrigger>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

export default ContextMenuSubTrigger;
