import { cn } from "@/lib/utils";

export default function AlertDialogHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left",
            className
        )}
        {...props}
    />;
}
