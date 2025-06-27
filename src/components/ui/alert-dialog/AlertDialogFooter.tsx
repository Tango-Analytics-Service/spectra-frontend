import { cn } from "@/lib/utils";
import React from "react";

export default function AlertDialogFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />;
}
