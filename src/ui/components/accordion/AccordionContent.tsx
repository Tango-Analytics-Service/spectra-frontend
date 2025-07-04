import React from "react";
import { Content } from "@radix-ui/react-accordion";
import { cn } from "@/lib/cn";

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof Content>,
    React.ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, ref) => (
    <Content
        ref={ref}
        className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </Content>
));
AccordionContent.displayName = "AccordionPrimitive";

export default AccordionContent;
