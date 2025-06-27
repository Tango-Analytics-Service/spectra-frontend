import React from "react";
import { Header, Trigger } from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof Trigger>,
    React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
    <Header className="flex">
        <Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </Trigger>
    </Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;
