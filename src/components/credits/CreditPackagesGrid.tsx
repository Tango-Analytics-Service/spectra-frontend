// src/components/credits/CreditPackagesGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditPackage } from "@/types/credits";
import { Coins, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CreditPackagesGridProps {
    packages: CreditPackage[];
    onPurchase: (packageId: string) => void;
}

// Функция для динамического определения цвета пакета
function getBgColorForPackage(packageId: number, type: "bar" | "button" | "badge" = "bar",): string {
    switch (packageId) {
        case 0:
            return type === "bar"
                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                : type === "button"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    : "bg-blue-500/10 text-blue-400";
        case 1:
            return type === "bar"
                ? "bg-gradient-to-r from-teal-400 to-green-500"
                : type === "button"
                    ? "bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700"
                    : "bg-teal-500/10 text-teal-400";
        case 2:
            return type === "bar"
                ? "bg-gradient-to-r from-purple-400 to-blue-500"
                : type === "button"
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    : "bg-purple-500/10 text-purple-400";
        case 3:
            return type === "bar"
                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                : type === "button"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    : "bg-amber-500/10 text-amber-400";
        case 4:
            return type === "bar"
                ? "bg-gradient-to-r from-red-400 to-pink-500"
                : type === "button"
                    ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    : "bg-red-500/10 text-red-400";
        default:
            return type === "bar"
                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                : type === "button"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    : "bg-blue-500/10 text-blue-400";
    }
}

export default function CreditPackagesGrid({ packages, onPurchase }: CreditPackagesGridProps) {
    return (
        <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-1 sm:pb-2">
                <CardTitle className="text-lg text-white">Пакеты кредитов</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg, index) => (
                        <Card
                            key={pkg.id}
                            className="bg-slate-900/50 border border-slate-700/50 hover:border-blue-500/30
                transition-colors overflow-hidden"
                        >
                            <div
                                className={`h-1 w-full ${getBgColorForPackage(index)}`}
                            ></div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-white">{pkg.name}</h3>
                                    <Badge
                                        variant="outline"
                                        className={`${getBgColorForPackage(index, "badge")} border-blue-500/20`}
                                    >
                                        {pkg.price_per_credit.toFixed(3)} RUB / кредит
                                    </Badge>
                                </div>

                                <div className="flex items-center mt-4 mb-3">
                                    <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                                    <div className="text-xl font-semibold text-white">
                                        {pkg.credits.toLocaleString()}
                                        <span className="text-sm text-blue-300 ml-1">кредитов</span>
                                    </div>
                                </div>

                                <div className="mt-2 text-sm text-blue-200 mb-4">
                                    <div className="flex items-center mb-1">
                                        <Check
                                            size={14}
                                            className="min-w-4 mr-1.5 text-green-400"
                                        />
                                        <span>Мгновенное зачисление</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Check
                                            size={14}
                                            className="min-w-4 mr-1.5 text-green-400"
                                        />
                                        <span>Безлимитный срок действия</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-lg font-bold text-white">
                                        {pkg.price} {pkg.currency}
                                    </div>
                                    <Button
                                        onClick={() => onPurchase(pkg.id)}
                                        className={`${getBgColorForPackage(index, "button")} text-white`}
                                    >
                                        Купить
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
