import { cn } from "@/lib/utils";
import PaginationLink from "./PaginationLink";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function PaginationNext({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>Next</span>
        <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>;
}
