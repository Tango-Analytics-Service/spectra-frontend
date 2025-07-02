import Card from "../ui/card/Card";
import CardContent from "../ui/card/CardContent";
import CardHeader from "../ui/card/CardHeader";
import CardTitle from "../ui/card/CardTitle";

// Feature card component
export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({
    icon,
    title,
    description,
}: FeatureCardProps) {
    return (
        <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20 hover:border-[#4395d3]/40 transition-all">
            <CardHeader className="pb-2">
                <div className="mb-4">{icon}</div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-300">{description}</p>
            </CardContent>
        </Card>
    );
};
