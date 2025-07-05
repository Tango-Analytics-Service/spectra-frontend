import { cn } from "@/lib/cn";

export default function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />;
}
