import { cn } from "@/lib/utils";

// Profile navigation button
export interface ProfileNavButtonProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

export default function ProfileNavButton({
    icon,
    label,
    active,
}: ProfileNavButtonProps) {
    return (
        <button
            className={cn(
                "flex items-center w-full px-3 py-2 rounded-lg transition-colors text-left",
                active
                    ? "bg-[#4395d3]/10 text-[#4395d3] font-medium"
                    : "text-gray-300 hover:bg-blue-900/20 hover:text-[#4395d3]",
            )}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </button>
    );
}
