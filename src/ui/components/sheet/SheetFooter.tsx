import React from "react";
import { cn } from "@/lib/cn";

export default function SheetFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div
        className={
            cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                className
            )
        }
        {...props}
    />;
}
