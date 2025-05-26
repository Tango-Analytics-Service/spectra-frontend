// src/components/filters/WebFiltersPage.tsx
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  typography,
  spacing,
  animations,
  createCardStyle,
} from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter as FilterIcon, Settings, Search } from "lucide-react";
import { useFilters } from "@/contexts/FilterContext";
import FiltersList from "./FiltersList";
import CreateFilterDialog from "./CreateFilterDialog";

const WebFiltersPage: React.FC = () => {
  const {
    fetchSystemFilters,
    fetchUserFilters,
    systemFilters,
    userFilters,
    isSystemFiltersLoading,
    isUserFiltersLoading,
  } = useFilters();

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load filters on component mount
  useEffect(() => {
    fetchSystemFilters();
    fetchUserFilters();
  }, [fetchSystemFilters, fetchUserFilters]);

  const isLoading = isSystemFiltersLoading || isUserFiltersLoading;
  const totalFilters =
    systemFilters.length + userFilters.filter((f) => f.is_custom).length;
  const systemFiltersCount = systemFilters.length;
  const customFiltersCount = userFilters.filter((f) => f.is_custom).length;

  return (
    <div className={cn("container mx-auto", animations.fadeIn)}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={typography.h1}>Фильтры для анализа</h1>
          <p className={cn(typography.small, "text-gray-300 mt-1")}>
            Управление системными и пользовательскими фильтрами для анализа
            каналов
          </p>
        </div>
        <Button
          className="bg-[#4395d3] hover:bg-[#3a80b9] text-white"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus size={16} className="mr-2" />
          Создать фильтр
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Всего фильтров</p>
                <h3 className="text-2xl font-bold">{totalFilters}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#4395d3]/20 flex items-center justify-center">
                <FilterIcon className="h-6 w-6 text-[#4395d3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Системные фильтры</p>
                <h3 className="text-2xl font-bold">{systemFiltersCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Мои фильтры</p>
                <h3 className="text-2xl font-bold">{customFiltersCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Plus className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-[#0a2a5e]/50 border border-[#4395d3]/20">
          <TabsTrigger value="all">Все фильтры</TabsTrigger>
          <TabsTrigger value="system">Системные</TabsTrigger>
          <TabsTrigger value="custom">Мои фильтры</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
            <CardContent className="p-6">
              <FiltersList height="h-[600px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
            <CardContent className="p-6">
              <FiltersList height="h-[600px]" filterType="system" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
            <CardContent className="p-6">
              <FiltersList height="h-[600px]" filterType="custom" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Filter Dialog */}
      {showCreateDialog && (
        <CreateFilterDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      )}
    </div>
  );
};

export default WebFiltersPage;
