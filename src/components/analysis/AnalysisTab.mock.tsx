// src/components/analysis/AnalysisTab.mock.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Play } from "lucide-react";
import { ChannelSet } from "@/types/channel-sets";
import StartAnalysisDialog from "./StartAnalysisDialog";
import AnalysisResultsCard from "./AnalysisResultsCard";
import { mockAnalysisResults } from "@/mocks/analysisMock";

interface AnalysisTabMockProps {
  channelSet: ChannelSet;
}

const AnalysisTabMock: React.FC<AnalysisTabMockProps> = ({ channelSet }) => {
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleStartAnalysis = async () => {
    setShowAnalysisDialog(false);
    // Simulate loading
    setTimeout(() => {
      setShowResults(true);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Анализ каналов</h3>
          <p className="text-sm text-blue-300">
            Проанализируйте каналы с помощью фильтров
          </p>
        </div>
        <Button
          onClick={() => setShowAnalysisDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          <Play size={16} className="mr-2" />
          Запустить анализ
        </Button>
      </div>

      {/* Content */}
      <div>
        {showResults ? (
          // Analysis results
          <AnalysisResultsCard results={mockAnalysisResults} />
        ) : (
          // No analysis yet
          <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <BarChart className="h-12 w-12 text-blue-400/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Нет данных анализа</h3>
                <p className="text-sm text-blue-300 mb-4">
                  Запустите анализ, чтобы оценить каналы по выбранным фильтрам
                </p>
                <Button
                  onClick={() => setShowAnalysisDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                >
                  <Play size={16} className="mr-2" />
                  Запустить анализ
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis dialog */}
      <StartAnalysisDialog
        open={showAnalysisDialog}
        onOpenChange={setShowAnalysisDialog}
        onStart={handleStartAnalysis}
        setId={channelSet.id}
        channelCount={channelSet.channel_count}
      />
    </div>
  );
};

export default AnalysisTabMock;
