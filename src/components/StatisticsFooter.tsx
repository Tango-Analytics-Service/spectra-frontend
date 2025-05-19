import React from "react";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatisticsFooterProps {
  totalSets?: number;
  totalChannels?: number;
  onAnalyticsClick?: () => void;
}

const StatisticsFooter = ({
  totalSets = 3,
  totalChannels = 15,
  onAnalyticsClick = () => console.log("Analytics clicked"),
}: StatisticsFooterProps) => {
  return (
    <div className="w-full border-t border-gray-800 backdrop-blur-md p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <div className="flex gap-6 sm:gap-8 w-full sm:w-auto">
          <div>
            <div className="text-xs sm:text-sm text-blue-300">
              Всего наборов
            </div>
            <div className="text-lg sm:text-xl font-semibold">{totalSets}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-blue-300">
              Всего каналов
            </div>
            <div className="text-lg sm:text-xl font-semibold">
              {totalChannels}
            </div>
          </div>
        </div>
        <Button
          onClick={onAnalyticsClick}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all text-xs sm:text-sm py-2 h-8 sm:h-9"
        >
          <BarChart3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Аналитика
        </Button>
      </div>
    </div>
  );
};

export default StatisticsFooter;
