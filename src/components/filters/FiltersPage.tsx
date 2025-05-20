// src/components/filters/FiltersPage.tsx
import React, { useState, useEffect } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter as FilterIcon, Settings } from "lucide-react";
import FiltersList from "./FiltersList";
import CreateFilterDialog from "./CreateFilterDialog";

const FiltersPage: React.FC = () => {
  const {
    fetchSystemFilters,
    fetchUserFilters,
    systemFilters,
    userFilters,
    isSystemFiltersLoading,
    isUserFiltersLoading,
  } = useFilters();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load filters on component mount
  useEffect(() => {
    fetchSystemFilters();
    fetchUserFilters();
  }, [fetchSystemFilters, fetchUserFilters]);

  const isLoading = isSystemFiltersLoading || isUserFiltersLoading;
  const totalFilters =
    systemFilters.length + userFilters.filter((f) => f.is_custom).length;

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Фильтры для анализа
          </h1>
          <p className="text-sm text-blue-300 mt-1">
            Управление системными и пользовательскими фильтрами для анализа
            каналов
          </p>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          <Plus size={16} className="mr-2" />
          Создать фильтр
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Всего фильтров"
          value={totalFilters}
          icon={<FilterIcon size={20} className="text-blue-400" />}
          bgColor="bg-blue-500/10"
        />
        <StatsCard
          title="Системные фильтры"
          value={systemFilters.length}
          icon={<Settings size={20} className="text-purple-400" />}
          bgColor="bg-purple-500/10"
        />
        <StatsCard
          title="Мои фильтры"
          value={userFilters.filter((f) => f.is_custom).length}
          icon={<Plus size={20} className="text-green-400" />}
          bgColor="bg-green-500/10"
        />
      </div>

      {/* Filters list */}
      <div className="bg-slate-800/50 border border-blue-500/20 text-white rounded-xl p-6">
        <FiltersList height="h-[600px]" />
      </div>

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

// Stats card component
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
}) => (
  <div className="bg-slate-800/50 border border-blue-500/20 text-white rounded-xl p-4 flex items-center">
    <div className={`${bgColor} rounded-full p-3 mr-4`}>{icon}</div>
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-blue-300">{title}</div>
    </div>
  </div>
);

export default FiltersPage;
