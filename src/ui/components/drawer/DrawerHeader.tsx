import { cn } from "@/lib/cn";

export default function DrawerHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div
        className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
        {...props}
    />;
}
