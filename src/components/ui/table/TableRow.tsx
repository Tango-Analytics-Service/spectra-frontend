import React from "react";
import { cn } from "@/lib/utils";

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b transition-colors data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

export default TableRow;
