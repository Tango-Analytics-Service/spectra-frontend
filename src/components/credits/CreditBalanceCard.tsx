// src/components/credits/CreditBalanceCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { CreditBalance } from "@/types/credits";
import { textColors } from "@/lib/design-system";

export interface CreditBalanceCardProps {
    balance: CreditBalance;
}

export default function CreditBalanceCard({ balance }: CreditBalanceCardProps) {
    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-xs sm:text-sm text-blue-300">
                        Ваш баланс кредитов
                    </div>
                    <div className="flex items-center text-blue-300">
                        <Coins size={16} className="mr-1" />
                        <span className={textColors.muted}>Обновлен: {formatDate(balance.last_updated)}</span>
                    </div>
                </div>

                <div className="flex items-center">
                    <Coins className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-400" />
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                        {balance.balance.toLocaleString()}
                        <span className="text-sm text-blue-300 ml-2">кредитов</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
