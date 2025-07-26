import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { searchService } from "@/search/service";
import { SearchSession } from "@/search/types";
import AnalysisResultsCard from "@/analysis/components/AnalysisResultsCard";
import { typography, spacing, animations, createTextStyle } from "@/lib/design-system";
import { Button } from "@/ui/components/button";

export default function SearchDetailsPage() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<SearchSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            setIsLoading(false);
            return;
        }

        searchService.getSearchResults(sessionId)
            .then(data => setSession(data))
            .catch(error => console.error("Failed to fetch session details:", error))
            .finally(() => setIsLoading(false));
    }, [sessionId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className={cn("flex flex-col items-center justify-center h-full text-center", `p-${spacing.md}`)}>
                <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                <h2 className={typography.h2}>Ошибка</h2>
                <p className={cn(createTextStyle("body", "secondary"), "mb-6")}>Не удалось загрузить данные по этому запросу.</p>
                <Button onClick={() => navigate(-1)}>Назад</Button>
            </div>
        );
    }

    return (
        <div className={cn("container mx-auto max-w-5xl", `py-${spacing.lg} px-${spacing.md}`, animations.fadeIn)}>
            <div className="mb-6 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="p-0 bg-transparent border-none outline-none hover:opacity-70 transition"
                    aria-label="Назад"
                >
                    <ArrowLeft className="h-6 w-6 text-white" />
                </button>
                <div>
                    <h1 className={typography.h3}>{session.search_query}</h1>
                    <p className={createTextStyle("small", "secondary")}>
                        Результаты поиска от {new Date(session.created_at).toLocaleString("ru-RU")}
                    </p>
                </div>
            </div>
            <AnalysisResultsCard
                results={{
                    id: session.search_session_id,
                    status: session.status,
                    created_at: session.created_at,
                    updated_at: session.updated_at,
                    results: session.analysis_results,
                    summary: session.analysis_summary,
                }}
            />
        </div>
    );
}