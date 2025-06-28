import React from "react";
import { cn } from "@/lib/utils";

export default function SheetHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div
        className={
            cn(
                "flex flex-col space-y-2 text-center sm:text-left",
                className
            )
        }
        {...props}
    />;
}
