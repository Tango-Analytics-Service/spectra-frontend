import React from "react";
import { cn } from "@/lib/cn";

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>((cell, ref) => (
    <td
        ref={ref}
        className={cn(
            "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            cell.className
        )}
    />
));
TableCell.displayName = "TableCell";

export default TableCell;
