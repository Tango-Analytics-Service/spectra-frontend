import { useNavigate } from "react-router-dom";
import { SearchSession } from "../types";
import { cn } from "@/lib/cn";
import { createCardStyle, typography, spacing, createTextStyle } from "@/lib/design-system";
import { Zap } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface SearchSessionCardProps {
    session: SearchSession;
    // The onSelect prop is no longer needed
}

export default function SearchSessionCard({ session }: SearchSessionCardProps) {
    const navigate = useNavigate(); // Use the navigate hook
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString("ru-RU");
    const isClickable = session.status === "completed";

    const handleClick = () => {
        if (isClickable) {
            // Navigate to the details page using the session ID
            navigate(`/searches/${session.search_session_id}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                createCardStyle(),
                "border-yellow-500/30 transition-all",
                `p-${spacing.md}`,
                isClickable && "cursor-pointer hover:border-yellow-500/60"
            )}
            role={isClickable ? "button" : "figure"}
            tabIndex={isClickable ? 0 : -1}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
        >
            <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={18} className="text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn(typography.h4, "text-white")}>
                                    {session.search_query}
                                </h3>
                                <StatusBadge status={session.status} />
                            </div>
                            <p className={cn(createTextStyle("small", "muted"))}>
                                Запрос от {formatDate(session.created_at)}
                            </p>
                        </div>
                    </div>
                    {session.status === "failed" && session.error_message && (
                        <p className={cn(createTextStyle("small", "error"), "mt-2")}>{session.error_message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}