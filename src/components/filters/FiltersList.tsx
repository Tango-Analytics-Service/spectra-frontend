// src/components/filters/FiltersList.tsx
import React, { useState, useEffect } from "react";
import { Filter, useFilters } from "@/contexts/FilterContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FilterIcon, Plus, AlertCircle, Loader2 } from "lucide-react";
import FilterCard from "./FilterCard";
import CreateFilterDialog from "./CreateFilterDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FiltersListProps {
  onSelectFilter?: (id: string) => void;
  selectedFilters?: string[];
  showActions?: boolean;
  height?: string;
}

const FiltersList: React.FC<FiltersListProps> = ({
  onSelectFilter,
  selectedFilters = [],
  showActions = true,
  height = "h-[400px]",
}) => {
  const {
    systemFilters,
    userFilters,
    isSystemFiltersLoading,
    isUserFiltersLoading,
    fetchSystemFilters,
    fetchUserFilters,
    deleteCustomFilter,
  } = useFilters();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load filters on component mount
  useEffect(() => {
    fetchSystemFilters();
    fetchUserFilters();
  }, [fetchSystemFilters, fetchUserFilters]);

  // Filter and categorize filters
  const allFilters = [...systemFilters, ...userFilters];

  // Remove duplicates (in case system filters are also included in user filters)
  const uniqueFilters = allFilters.filter(
    (filter, index, self) =>
      index === self.findIndex((f) => f.id === filter.id),
  );

  // Get custom filters
  const customFilters = userFilters.filter((filter) => filter.is_custom);

  // Filter by search query
  const filteredFilters = uniqueFilters.filter((filter) =>
    searchQuery
      ? filter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        filter.criteria.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (filter.category &&
          filter.category.toLowerCase().includes(searchQuery.toLowerCase()))
      : true,
  );

  // Group filters by category
  const filtersByCategory = filteredFilters.reduce(
    (acc, filter) => {
      const category = filter.category || "Другое";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(filter);
      return acc;
    },
    {} as Record<string, Filter[]>,
  );

  // Sort categories alphabetically
  const sortedCategories = Object.keys(filtersByCategory).sort();

  // Handle filter selection
  const handleSelectFilter = (id: string) => {
    if (onSelectFilter) {
      onSelectFilter(id);
    }
  };

  // Handle filter deletion
  const handleDeleteFilter = async (id: string) => {
    await deleteCustomFilter(id);
  };

  // Determine if filters are loading
  const isLoading = isSystemFiltersLoading || isUserFiltersLoading;

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Поиск фильтров..."
            className="pl-9 bg-slate-900/70 border-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {showActions && (
          <Button
            variant="outline"
            onClick={() => setShowCreateDialog(true)}
            className="border-blue-500/20 text-blue-300"
          >
            <Plus size={16} className="mr-1" />
            Создать
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-500">
            Все
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-blue-500"
          >
            Системные
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="data-[state=active]:bg-blue-500"
          >
            Мои
          </TabsTrigger>
        </TabsList>

        {/* All Filters Tab */}
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : filteredFilters.length === 0 ? (
            <Alert className="bg-slate-800/50 border border-blue-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ничего не найдено</AlertTitle>
              <AlertDescription>
                Попробуйте изменить запрос или создайте свой фильтр
              </AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className={`${height} pr-4`}>
              <div className="space-y-6">
                {sortedCategories.map((category) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-blue-300 mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filtersByCategory[category].map((filter) => (
                        <FilterCard
                          key={filter.id}
                          filter={filter}
                          selected={selectedFilters.includes(filter.id)}
                          onSelect={handleSelectFilter}
                          onDelete={
                            filter.is_custom ? handleDeleteFilter : undefined
                          }
                          showActions={showActions}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        {/* System Filters Tab */}
        <TabsContent value="system" className="mt-4">
          {isSystemFiltersLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : filteredFilters.filter((f) => !f.is_custom).length === 0 ? (
            <Alert className="bg-slate-800/50 border border-blue-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ничего не найдено</AlertTitle>
              <AlertDescription>Попробуйте изменить запрос</AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className={`${height} pr-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredFilters
                  .filter((f) => !f.is_custom)
                  .map((filter) => (
                    <FilterCard
                      key={filter.id}
                      filter={filter}
                      selected={selectedFilters.includes(filter.id)}
                      onSelect={handleSelectFilter}
                      showActions={showActions}
                    />
                  ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        {/* Custom Filters Tab */}
        <TabsContent value="custom" className="mt-4">
          {isUserFiltersLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : customFilters.length === 0 ? (
            <div className="text-center py-10 border border-blue-500/20 rounded-lg bg-slate-800/50">
              <div className="flex flex-col items-center justify-center">
                <FilterIcon size={48} className="text-blue-400/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Нет пользовательских фильтров
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Создайте свой первый фильтр для анализа каналов
                </p>
                {showActions && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  >
                    Создать фильтр
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <ScrollArea className={`${height} pr-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customFilters
                  .filter((filter) =>
                    searchQuery
                      ? filter.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        filter.criteria
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true,
                  )
                  .map((filter) => (
                    <FilterCard
                      key={filter.id}
                      filter={filter}
                      selected={selectedFilters.includes(filter.id)}
                      onSelect={handleSelectFilter}
                      onDelete={handleDeleteFilter}
                      showActions={showActions}
                    />
                  ))}
              </div>
            </ScrollArea>
          )}
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

export default FiltersList;
