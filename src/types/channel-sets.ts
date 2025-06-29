// src/types/channel-sets.ts - Обновленные типы с Smart Sets

export interface ChannelSetPermissions {
  can_view: boolean;
  can_edit: boolean;
  can_manage_channels: boolean;
  can_delete: boolean;
  can_analyze: boolean;
}

export interface ChannelInSet {
  username: string;
  channel_id?: number;
  is_parsed: boolean;
  added_at: string;
  // Smart Set fields
  inclusion_score?: number; // 0.0-1.0
  inclusion_reason?: string;
}

export interface SmartSetBuildCriteria {
  filter_ids: string[];
  target_count: number;
  acceptance_threshold: number;
  custom_prompt?: string;
  batch_size: number;
}

export interface SmartSetBuildProgress {
  channels_analyzed: number;
  channels_accepted: number;
  target_count: number;
  success_rate: number;
  current_batch: number;
}

export type SmartSetBuildStatus =
  | "building"
  | "completed"
  | "failed"
  | "cancelled";
export type ChannelSetType = "manual" | "smart";

export interface ChannelSet {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  is_predefined: boolean;
  is_owned_by_user: boolean;
  owner_id?: string;
  created_at: string;
  updated_at?: string;
  channel_count: number;
  channels: ChannelInSet[];
  all_parsed: boolean;
  permissions: ChannelSetPermissions;

  // Smart Set fields
  type: ChannelSetType;
  build_status?: SmartSetBuildStatus;
  build_progress?: SmartSetBuildProgress;
  build_criteria?: SmartSetBuildCriteria;
}

export interface CreateChannelSetRequest {
  name: string;
  description: string;
  is_public: boolean;
  // Smart Set creation
  build_criteria?: SmartSetBuildCriteria;
}

export interface UpdateChannelSetRequest {
  name?: string;
  description?: string;
  is_public?: boolean;
  // Note: build_criteria cannot be updated for smart sets
}

export interface AddChannelsRequest {
  usernames: string[];
}

export interface RemoveChannelsRequest {
  usernames: string[];
}

export interface AnalyzeChannelSetRequest {
  filter_ids: string[];
  options?: any; // AnalysisOptions
}

export interface ChannelSetListResponse {
  sets: ChannelSet[];
  count: number;
}

export interface ParsingStatusResponse {
  success: boolean;
  all_parsed: boolean;
  total_channels: number;
  parsed_channels: number;
  unparsed_channels: number;
  newly_parsed: string[];
  still_unparsed: string[];
  channels_status: any[];
  message?: string;
}

export interface SmartSetBuildStatusResponse {
  channel_set_id: string;
  status: SmartSetBuildStatus;
  progress?: SmartSetBuildProgress;
  error_message?: string;
  estimated_completion_time?: string;
}

// Дополнительные типы для удобства
export interface ChannelDetails {
  username: string;
  title?: string;
  stats?: {
    subscribers_count: number;
    average_views: number;
  };
}

export enum ChannelParsingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}
