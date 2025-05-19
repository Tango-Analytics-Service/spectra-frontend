// src/mocks/creditsMock.ts
import {
  ActionType,
  CreditBalance,
  CreditTransaction,
  CreditPackage,
  CreditCost,
} from "../types/credits";

export const mockCreditBalance: CreditBalance = {
  user_id: "user123",
  balance: 1250,
  last_updated: new Date().toISOString(),
};

export const mockCreditTransactions: CreditTransaction[] = [
  {
    id: "tr1",
    amount: -50,
    action_type: ActionType.ANALYZE_CHANNEL_SET,
    resource_id: "24083538-67db-4339-b9fd-93d293c31458",
    description: "Анализ набора 'Тестовый набор'",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 час назад
  },
  {
    id: "tr2",
    amount: 500,
    action_type: ActionType.PACKAGE_PURCHASE,
    resource_id: "pkg2",
    description: "Покупка пакета 'Стартовый'",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
  },
  {
    id: "tr3",
    amount: -25,
    action_type: ActionType.ADD_CHANNEL,
    resource_id: "ch456",
    description: "Добавление канала 'technomotel'",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
  },
  {
    id: "tr4",
    amount: 800,
    action_type: ActionType.PACKAGE_PURCHASE,
    resource_id: "pkg3",
    description: "Покупка пакета 'Профессиональный'",
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 дней назад
  },
  {
    id: "tr5",
    amount: 50,
    action_type: ActionType.REFERRAL_BONUS,
    description: "Бонус за приглашенного пользователя",
    timestamp: new Date(Date.now() - 1209600000).toISOString(), // 14 дней назад
  },
];

export const mockCreditPackages: CreditPackage[] = [
  {
    id: "pkg1",
    name: "Базовый",
    credits: 100,
    price: 5,
    currency: "USD",
    price_per_credit: 0.05,
  },
  {
    id: "pkg2",
    name: "Стартовый",
    credits: 500,
    price: 20,
    currency: "USD",
    price_per_credit: 0.04,
  },
  {
    id: "pkg3",
    name: "Профессиональный",
    credits: 1000,
    price: 35,
    currency: "USD",
    price_per_credit: 0.035,
  },
  {
    id: "pkg4",
    name: "Бизнес",
    credits: 3000,
    price: 90,
    currency: "USD",
    price_per_credit: 0.03,
  },
  {
    id: "pkg5",
    name: "Предприятие",
    credits: 10000,
    price: 250,
    currency: "USD",
    price_per_credit: 0.025,
  },
];

export const mockCreditCosts: CreditCost[] = [
  {
    action_type: ActionType.CREATE_CHANNEL_SET,
    cost: 10,
    description: "Создание нового набора каналов",
  },
  {
    action_type: ActionType.ADD_CHANNEL,
    cost: 25,
    description: "Добавление канала в набор",
  },
  {
    action_type: ActionType.ANALYZE_CHANNEL_SET,
    cost: 50,
    description: "Анализ набора каналов",
  },
  {
    action_type: ActionType.GENERATE_REPORT,
    cost: 75,
    description: "Генерация подробного отчета",
  },
  {
    action_type: ActionType.EXPORT_DATA,
    cost: 30,
    description: "Экспорт данных в CSV/Excel",
  },
];
