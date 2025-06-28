import { cn } from "@/lib/utils";

export default function DrawerFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        {...props}
    />;
}
