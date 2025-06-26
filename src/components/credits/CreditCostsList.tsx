// src/components/credits/CreditCostsList.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCost } from "@/types/credits";
import { Coins } from "lucide-react";

interface CreditCostsListProps {
  costs: CreditCost[];
}

const CreditCostsList = ({ costs }: CreditCostsListProps) => {
    return (
        <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-1 sm:pb-2">
                <CardTitle className="text-lg text-white">Стоимость действий</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                    {costs.map((cost) => (
                        <div
                            key={cost.action_type}
                            className="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/80 
                transition-colors border border-slate-700/50 hover:border-blue-500/30 
                flex justify-between items-center"
                        >
                            <div>
                                <div className="font-medium">
                                    {getActionName(cost.action_type)}
                                </div>
                                <div className="text-xs text-blue-300 mt-1">
                                    {cost.description}
                                </div>
                            </div>
                            <div className="flex items-center text-amber-400 font-semibold">
                                <span>{cost.cost}</span>
                                <Coins size={16} className="ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Функция для получения русского названия действия
function getActionName(actionType: string): string {
    switch (actionType) {
    case "CREATE_CHANNEL_SET":
        return "Создание набора каналов";
    case "ADD_CHANNEL":
        return "Добавление канала";
    case "ANALYZE_CHANNEL_SET":
        return "Анализ набора каналов";
    case "GENERATE_REPORT":
        return "Генерация отчета";
    case "EXPORT_DATA":
        return "Экспорт данных";
    default:
        return actionType;
    }
}

export default CreditCostsList;
