import { cn } from "@/lib/cn";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <DotsHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>;
}
