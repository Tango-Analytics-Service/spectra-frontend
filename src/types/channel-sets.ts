import { AnalysisOptions } from "./analysis";

// src/types/channel-sets.ts
export interface ChannelInSet {
  username: string;
  channel_id?: number;
  is_parsed: boolean;
  added_at: string;
}

export interface ChannelSet {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  is_predefined: boolean;
  created_at: string;
  updated_at?: string;
  channel_count: number;
  channels: ChannelInSet[];
  all_parsed: boolean;
}

export interface ChannelSetListResponse {
  sets: ChannelSet[];
  count: number;
}

export interface CreateChannelSetRequest {
  name: string;
  description: string;
  is_public: boolean;
}

export interface UpdateChannelSetRequest {
  name?: string;
  description?: string;
  is_public?: boolean;
}

export interface AddChannelsRequest {
  usernames: string[];
}

export interface RemoveChannelsRequest {
  usernames: string[];
}

export interface AnalyzeChannelSetRequest {
  filter_ids: string[];
  options?: AnalysisOptions;
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

export enum ChannelParsingStatus {
  PARSED = "parsed",
  UNPARSED = "unparsed",
  PARSING = "parsing",
  ERROR = "error",
}

export interface ChannelStats {
  posts_count: number;
  subscribers_count: number;
  average_views: number;
  average_reactions: number;
  last_post_date?: string;
}

export interface ChannelDetails extends ChannelInSet {
  title?: string;
  description?: string;
  avatar_url?: string;
  stats?: ChannelStats;
  category?: string;
  language?: string;
  status?: ChannelParsingStatus;
}
