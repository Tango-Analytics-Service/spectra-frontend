// src/components/credits/CreditTransactionsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { CreditTransaction } from "@/types/credits";
import { Button } from "@/components/ui/button";

interface CreditTransactionsListProps {
    transactions: CreditTransaction[];
}

const CreditTransactionsList = ({
    transactions,
}: CreditTransactionsListProps) => {
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
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-1 sm:pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white">
                        История транзакций
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-400 hover:bg-white/10"
                    >
                        <Filter size={16} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
                <div className="space-y-3">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="p-3ActionType  rounded-lg bg-slate-900/50 hover:bg-slate-900/80
                transition-colors border border-slate-700/50 hover:border-blue-500/30"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                    <div
                                        className={`p-2 rounded-full ${transaction.amount > 0
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-amber-500/10 text-amber-400"
                                        } mr-3`}
                                    >
                                        {transaction.amount > 0 ? (
                                            <ArrowUpRight size={16} />
                                        ) : (
                                            <ArrowDownRight size={16} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">
                                            {transaction.description}
                                        </div>
                                        <div className="text-xs text-blue-300 mt-1">
                                            {formatDate(transaction.timestamp)}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`font-semibold ${transaction.amount > 0 ? "text-green-400" : "text-amber-400"
                                    }`}
                                >
                                    {transaction.amount > 0 ? "+" : ""}
                                    {transaction.amount}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default CreditTransactionsList;
