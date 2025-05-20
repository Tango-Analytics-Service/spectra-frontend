// src/mocks/analysisMock.ts
import { AnalysisResults, AnalysisTask } from "@/types/analysis";

export const mockAnalysisResults: AnalysisResults = {
  results: [
    {
      channel_id: "bbcrussian",
      description: "BBC News Русская служба",
      filter_results: [
        {
          filter_id: "sf1",
          filter_name: "Без нецензурной лексики",
          score: 9.5,
          passed: true,
          explanation:
            "Канал соблюдает высокие стандарты языка, нецензурная лексика отсутствует",
          problematic_posts: [],
        },
        {
          filter_id: "sf2",
          filter_name: "Высокая вовлеченность",
          score: 7.8,
          passed: true,
          explanation:
            "Хороший уровень вовлеченности аудитории, много комментариев и реакций",
          problematic_posts: [],
        },
        {
          filter_id: "sf3",
          filter_name: "Качественный контент",
          score: 8.9,
          passed: true,
          explanation:
            "Контент информативный, хорошо структурированный и профессионально подготовленный",
          problematic_posts: [],
        },
      ],
      overall_status: "approved",
    },
    {
      channel_id: "rtnews",
      description: "RT News",
      filter_results: [
        {
          filter_id: "sf1",
          filter_name: "Без нецензурной лексики",
          score: 8.7,
          passed: true,
          explanation:
            "Канал соблюдает стандарты языка, нецензурная лексика отсутствует",
          problematic_posts: [],
        },
        {
          filter_id: "sf2",
          filter_name: "Высокая вовлеченность",
          score: 6.5,
          passed: true,
          explanation: "Средний уровень вовлеченности аудитории",
          problematic_posts: [],
        },
        {
          filter_id: "sf3",
          filter_name: "Качественный контент",
          score: 5.8,
          passed: false,
          explanation:
            "Контент не всегда объективен, иногда присутствует предвзятость",
          problematic_posts: [
            {
              post_id: "12345",
              url: "https://t.me/rtnews/12345",
              issue:
                "Предвзятое освещение событий без представления альтернативных точек зрения",
            },
          ],
        },
      ],
      overall_status: "rejected",
    },
    {
      channel_id: "techcrunch",
      description: "TechCrunch",
      filter_results: [
        {
          filter_id: "sf1",
          filter_name: "Без нецензурной лексики",
          score: 9.8,
          passed: true,
          explanation: "Канал полностью соответствует стандартам языка",
          problematic_posts: [],
        },
        {
          filter_id: "sf2",
          filter_name: "Высокая вовлеченность",
          score: 8.2,
          passed: true,
          explanation:
            "Высокий уровень вовлеченности аудитории, активные обсуждения",
          problematic_posts: [],
        },
        {
          filter_id: "sf3",
          filter_name: "Качественный контент",
          score: 9.1,
          passed: true,
          explanation: "Контент высокого качества, информативный и актуальный",
          problematic_posts: [],
        },
      ],
      overall_status: "approved",
    },
  ],
  summary: {
    total_channels: 3,
    approved_channels: 2,
    rejected_channels: 1,
  },
  task_id: "task-123",
  status: "completed",
  started_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  completed_at: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
};

export const mockAnalysisTask: AnalysisTask = {
  id: "task-123",
  type: "channel_analysis",
  status: "completed",
  created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
  completed_at: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
  channel_set_id: "1",
  filter_ids: ["sf1", "sf2", "sf3"],
  results: mockAnalysisResults,
};

export const mockAnalysisTaskInProgress: AnalysisTask = {
  id: "task-124",
  type: "channel_analysis",
  status: "processing",
  created_at: new Date(Date.now() - 0.2 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 0.1 * 60 * 60 * 1000).toISOString(),
  channel_set_id: "2",
  filter_ids: ["sf1", "sf2", "sf3", "sf4"],
};
