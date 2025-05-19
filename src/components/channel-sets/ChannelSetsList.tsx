import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Globe,
  Lock,
  Star,
} from "lucide-react";

// Компонент только для отображения списка наборов каналов
const ChannelSetsList = ({
  channelSets,
  isLoading,
  selectedSetId,
  onSelectSet,
  onViewDetails,
  viewMode = "grid",
}) => {
  // Format date to DD.MM.YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  // Render empty state
  if (channelSets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
        <Users size={48} className="text-blue-400/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          У вас пока нет наборов каналов
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Нажмите 'Создать новый набор', чтобы начать
        </p>
      </div>
    );
  }

  // Render grid view
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channelSets.map((set, index) => (
          <motion.div
            key={set.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-slate-800/40 backdrop-blur-sm rounded-xl border ${
              selectedSetId === set.id
                ? "border-blue-500/50"
                : "border-slate-700/50"
            } overflow-hidden shadow-lg shadow-slate-900/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer`}
            onClick={() => onSelectSet(set.id)}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-white mr-2">{set.name}</h3>
                    {set.is_predefined && (
                      <Star size={14} className="text-yellow-400" />
                    )}
                    {set.is_public ? (
                      <Globe size={14} className="ml-1 text-blue-400" />
                    ) : (
                      <Lock size={14} className="ml-1 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-blue-300/70 mt-0.5 line-clamp-1">
                    {set.description}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <Users size={16} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mt-3">
                <div className="flex items-center text-blue-300/70">
                  <Calendar size={12} className="mr-1" />
                  <span>Обновлен: {formatDate(set.updated_at)}</span>
                </div>

                <div className="flex items-center">
                  {set.all_parsed ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      <CheckCircle size={10} />
                      <span>Готов</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                      <AlertCircle size={10} />
                      <span>Обработка</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-blue-300/70">Каналов:</span>
                  <span className="ml-1 font-semibold text-white">
                    {set.channel_count}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(set.id);
                  }}
                >
                  <span>Подробнее</span>
                  <ArrowRight size={14} className="ml-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Render list view
  return (
    <div className="space-y-3">
      {channelSets.map((set, index) => (
        <motion.div
          key={set.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`p-3 rounded-lg flex items-center ${
            selectedSetId === set.id
              ? "bg-gradient-to-r from-blue-600/10 to-blue-500/5 border border-blue-500/30"
              : "bg-slate-800/40 border border-slate-700/50"
          } hover:border-blue-500/30 transition-all duration-200 cursor-pointer`}
          onClick={() => onSelectSet(set.id)}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20">
            {set.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div className="font-medium text-white truncate max-w-[80%]">
                {set.name}
              </div>
              {set.is_predefined && (
                <Star size={12} className="ml-2 text-yellow-400" />
              )}
              {set.is_public ? (
                <div className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                  <Globe size={8} />
                  <span>Публичный</span>
                </div>
              ) : null}
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <span className="truncate mr-2 max-w-[60%]">
                {set.description}
              </span>
              <Users size={12} className="mr-1" />
              <span>{set.channel_count}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-blue-300 whitespace-nowrap">
              {formatDate(set.updated_at)}
            </div>
            <motion.button
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(set.id);
              }}
            >
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChannelSetsList;
