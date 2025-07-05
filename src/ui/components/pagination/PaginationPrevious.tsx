import { cn } from "@/lib/cn";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import PaginationLink from "./PaginationLink";

export default function PaginationPrevious({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeftIcon className="h-4 w-4" />
        <span>Previous</span>
    </PaginationLink>;
}
