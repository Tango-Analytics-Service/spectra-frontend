import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Desktop nav link
export interface NavLinkProps {
    to: string;
    label: string;
}

export default function NavLink({ to, label }: NavLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "text-gray-300 hover:text-blue-400 hover:bg-blue-500/10",
            )}
        >
            {label}
        </Link>
    );
};
