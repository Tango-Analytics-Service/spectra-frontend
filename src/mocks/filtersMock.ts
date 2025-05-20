// src/mocks/filtersMock.ts
import { Filter } from "@/contexts/FilterContext";

export const mockSystemFilters: Filter[] = [
  {
    id: "sf1",
    name: "Без нецензурной лексики",
    criteria: "Канал не должен содержать нецензурную лексику и оскорбления",
    threshold: 7,
    strictness: 0.8,
    category: "Содержание",
    created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    is_custom: false,
  },
  {
    id: "sf2",
    name: "Высокая вовлеченность",
    criteria:
      "Канал должен иметь высокий уровень вовлеченности аудитории (комментарии, реакции)",
    threshold: 6,
    strictness: 0.7,
    category: "Вовлеченность",
    created_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    is_custom: false,
  },
  {
    id: "sf3",
    name: "Качественный контент",
    criteria:
      "Контент должен быть информативным, полезным и хорошо структурированным",
    threshold: 8,
    strictness: 0.9,
    category: "Качество",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    is_custom: false,
  },
  {
    id: "sf4",
    name: "Безопасный для брендов",
    criteria: "Контент должен быть безопасным для размещения рекламы брендов",
    threshold: 9,
    strictness: 1.0,
    category: "Безопасность",
    created_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    is_custom: false,
  },
  {
    id: "sf5",
    name: "Стабильный рост",
    criteria:
      "Канал должен демонстрировать стабильный рост подписчиков и просмотров",
    threshold: 5,
    strictness: 0.6,
    category: "Рост",
    created_at: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    is_custom: false,
  },
];

export const mockUserFilters: Filter[] = [
  ...mockSystemFilters,
  {
    id: "uf1",
    name: "Мой фильтр: Технологии",
    criteria: "Канал должен быть посвящен технологиям и IT",
    threshold: 6,
    strictness: 0.7,
    category: "Содержание",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    is_custom: true,
  },
  {
    id: "uf2",
    name: "Мой фильтр: Бизнес",
    criteria: "Канал должен содержать информацию о бизнесе и финансах",
    threshold: 7,
    strictness: 0.8,
    category: "Содержание",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_custom: true,
  },
];
