import React from "react";
import { Title } from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof Title>,
    React.ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => (
    <Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
));
SheetTitle.displayName = "SheetTitle";

export default SheetTitle;
