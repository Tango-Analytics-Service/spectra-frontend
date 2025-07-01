import Card from "../card/Card";
import CardContent from "../card/CardContent";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";

export interface LoadingCardProps {
    text?: string;
    className?: string;
}

export default function LoadingCard({
    text = "Загрузка...",
    className,
}: LoadingCardProps) {
    return (
        <Card className={cn("bg-[#0a2a5e]/50 border-[#4395d3]/20", className)}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" className="mb-3" />
                <p className="text-gray-300">{text}</p>
            </CardContent>
        </Card>
    );
};
