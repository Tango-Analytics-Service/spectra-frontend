import React from "react";
import { SubTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/cn";

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof SubTrigger>,
    React.ComponentPropsWithoutRef<typeof SubTrigger> & {
        inset?: boolean
    }
>(({ className, inset, children, ...props }, ref) => (
    <SubTrigger
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
            inset && "pl-8",
            className
        )}
        {...props}
    >
        {children}
        <ChevronRightIcon className="ml-auto h-4 w-4" />
    </SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export default DropdownMenuSubTrigger;
