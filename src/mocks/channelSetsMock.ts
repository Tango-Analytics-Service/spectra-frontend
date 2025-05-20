// src/mocks/channelSetsMock.ts
import { ChannelSet, ChannelDetails } from "@/types/channel-sets";

export const mockChannelSets: ChannelSet[] = [
  {
    id: "1",
    name: "Новостные каналы",
    description: "Популярные новостные каналы",
    is_public: true,
    is_predefined: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    channel_count: 15,
    channels: [
      {
        username: "bbcrussian",
        channel_id: 1001,
        is_parsed: true,
        added_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "rtnews",
        channel_id: 1002,
        is_parsed: true,
        added_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "cnn",
        channel_id: 1003,
        is_parsed: true,
        added_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "foxnews",
        channel_id: 1004,
        is_parsed: false,
        added_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "reuters",
        channel_id: 1005,
        is_parsed: true,
        added_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    all_parsed: false,
  },
  {
    id: "2",
    name: "Технологии",
    description: "Каналы о технологиях и IT",
    is_public: false,
    is_predefined: false,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    channel_count: 8,
    channels: [
      {
        username: "techcrunch",
        channel_id: 2001,
        is_parsed: true,
        added_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "wired",
        channel_id: 2002,
        is_parsed: true,
        added_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "theverge",
        channel_id: 2003,
        is_parsed: true,
        added_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    all_parsed: true,
  },
  {
    id: "3",
    name: "Развлечения",
    description: "Развлекательные каналы и мемы",
    is_public: true,
    is_predefined: false,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    channel_count: 12,
    channels: [
      {
        username: "memetime",
        channel_id: 3001,
        is_parsed: true,
        added_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "funnyvideos",
        channel_id: 3002,
        is_parsed: false,
        added_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    all_parsed: false,
  },
  {
    id: "4",
    name: "Бизнес",
    description: "Каналы о бизнесе и финансах",
    is_public: false,
    is_predefined: true,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    channel_count: 10,
    channels: [
      {
        username: "bloomberg",
        channel_id: 4001,
        is_parsed: true,
        added_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        username: "forbes",
        channel_id: 4002,
        is_parsed: true,
        added_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    all_parsed: true,
  },
];

export const mockChannelDetails: ChannelDetails[] = [
  {
    username: "bbcrussian",
    channel_id: 1001,
    is_parsed: true,
    added_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    title: "BBC News Русская служба",
    description: "Новости BBC на русском языке",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bbcrussian",
    stats: {
      posts_count: 5432,
      subscribers_count: 450000,
      average_views: 120000,
      average_reactions: 3500,
      last_post_date: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    category: "Новости",
    language: "Русский",
    status: "parsed",
  },
  {
    username: "techcrunch",
    channel_id: 2001,
    is_parsed: true,
    added_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    title: "TechCrunch",
    description: "Новости технологий и стартапов",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=techcrunch",
    stats: {
      posts_count: 3210,
      subscribers_count: 320000,
      average_views: 85000,
      average_reactions: 2100,
      last_post_date: new Date(
        Date.now() - 0.5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    category: "Технологии",
    language: "Английский",
    status: "parsed",
  },
  {
    username: "memetime",
    channel_id: 3001,
    is_parsed: true,
    added_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Meme Time",
    description: "Лучшие мемы интернета",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=memetime",
    stats: {
      posts_count: 8765,
      subscribers_count: 780000,
      average_views: 250000,
      average_reactions: 15000,
      last_post_date: new Date(
        Date.now() - 0.1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    category: "Развлечения",
    language: "Русский",
    status: "parsed",
  },
];

export const searchChannelsResults = [
  {
    username: "bbcrussian",
    channel_id: 1001,
    is_parsed: true,
    added_at: new Date().toISOString(),
    title: "BBC News Русская служба",
    stats: {
      subscribers_count: 450000,
      average_views: 120000,
    },
  },
  {
    username: "rtnews",
    channel_id: 1002,
    is_parsed: true,
    added_at: new Date().toISOString(),
    title: "RT News",
    stats: {
      subscribers_count: 380000,
      average_views: 95000,
    },
  },
  {
    username: "cnn",
    channel_id: 1003,
    is_parsed: true,
    added_at: new Date().toISOString(),
    title: "CNN News",
    stats: {
      subscribers_count: 520000,
      average_views: 150000,
    },
  },
];
