import { cn } from "@/lib/cn";

export default function DrawerFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        {...props}
    />;
}
