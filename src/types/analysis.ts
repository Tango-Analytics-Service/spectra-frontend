// src/types/analysis.ts
import { ChannelSet } from "./channel-sets";

export enum ProcessingMode {
  BATCH = "batch",
  DIRECT = "direct",
}

export interface AnalysisOptions {
  detailed?: boolean;
  max_posts?: number;
  include_examples?: boolean;
  processing_mode?: ProcessingMode;
}

export interface ChannelAnalysisRequest {
  channels: string[];
  filter_ids: string[];
  options?: AnalysisOptions;
}

export interface ChannelAnalysisResponse {
  success: boolean;
  task_id: string;
  message: string;
}

export interface ProblematicPost {
  post_id: string;
  url: string;
  issue: string;
}

export interface FilterResult {
  filter_id: string;
  filter_name: string;
  score: number;
  passed: boolean;
  explanation: string;
  problematic_posts: ProblematicPost[];
}

export interface ChannelResult {
  channel_id: string;
  description?: string;
  filter_results: FilterResult[];
  overall_status: "approved" | "rejected" | "pending";
}

export interface AnalysisSummary {
  total_channels: number;
  approved_channels: number;
  rejected_channels: number;
}

export interface AnalysisResults {
  results: ChannelResult[];
  summary: AnalysisSummary;
  task_id?: string;
  status?: string;
  started_at?: string;
  completed_at?: string;
  channel_set?: ChannelSet;
}

export interface AnalysisTask {
  id: string;
  type: "channel_analysis";
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  completed_at?: string;
  channel_set_id?: string;
  filter_ids?: string[];
  results?: AnalysisResults;
  error?: string;
}
