import { cn } from "@/lib/cn";
import React from "react";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    > </h3>
));
CardTitle.displayName = "CardTitle";

export default CardTitle;
