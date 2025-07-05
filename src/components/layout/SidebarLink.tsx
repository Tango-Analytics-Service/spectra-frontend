import { cn } from "@/lib/cn";

// Sidebar link component
export interface SidebarLinkProps {
    href: string;
    label: string;
    active?: boolean;
}

export default function SidebarLink({ href, label, active }: SidebarLinkProps) {
    return (
        <a
            href={href}
            className={cn(
                "flex items-center px-4 py-2 rounded-lg transition-colors",
                active
                    ? "bg-[#4395d3]/10 text-[#4395d3] font-medium"
                    : "text-gray-300 hover:bg-blue-900/20 hover:text-[#4395d3]",
            )}
        >{label}</a>
    );
};
