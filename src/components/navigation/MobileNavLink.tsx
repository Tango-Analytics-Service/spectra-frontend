import { cn } from "@/lib/cn";
import { Link } from "react-router-dom";

// Mobile nav link
export interface MobileNavLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

export default function MobileNavLink({
    to,
    icon,
    label,
    onClick,
}: MobileNavLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                "flex items-center px-2 py-2 rounded-md transition-colors",
                "text-gray-300 hover:text-blue-400 hover:bg-blue-500/10",
            )}
            onClick={onClick}
        >
            <span className="mr-3 text-blue-400">{icon}</span>
            {label}
        </Link>
    );
}
