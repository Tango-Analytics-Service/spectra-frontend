// src/services/creditService.ts
import { httpClient } from "./httpClient";
import { ActionType } from "../types/credits";

const API_ENDPOINT = "/credits";

export interface CreditBalance {
  user_id: string;
  balance: number;
  last_updated: string;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  action_type: string;
  resource_id?: string;
  description: string;
  timestamp: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  price_per_credit: number;
}

export interface CreditCost {
  action_type: string;
  cost: number;
  description: string;
}

export interface CreditTransactionsResponse {
  transactions: CreditTransaction[];
  count: number;
}

export interface CreditPackagesResponse {
  packages: CreditPackage[];
  count: number;
}

export interface CreditCostsResponse {
  costs: CreditCost[];
  count: number;
}

export interface PaymentInfo {
  id: string;
  method: string;
  amount: number;
  currency: string;
}

export interface PackageInfo {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export interface PurchasePackageRequest {
  payment_method: string;
  payment_details?: any;
}

export interface PurchasePackageResponse {
  success: boolean;
  message: string;
  package: PackageInfo;
  payment: PaymentInfo;
  new_balance: number;
}

export interface CheckActionResponse {
  can_perform: boolean;
  message: string;
  required: number;
  available: number;
}

export const creditService = {
  /**
   * Get user's credit balance
   */
  getCreditBalance: async (): Promise<CreditBalance> => {
    return httpClient.get<CreditBalance>(`${API_ENDPOINT}/balance`);
  },

  /**
   * Get user's credit transactions with optional filtering
   */
  getCreditTransactions: async (
    limit: number = 50,
    offset: number = 0,
    startDate?: string,
    endDate?: string,
    actionTypes?: string[],
  ): Promise<CreditTransactionsResponse> => {
    let url = `${API_ENDPOINT}/transactions?limit=${limit}&offset=${offset}`;

    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    if (actionTypes && actionTypes.length > 0) {
      actionTypes.forEach((type) => {
        url += `&action_types=${type}`;
      });
    }

    return httpClient.get<CreditTransactionsResponse>(url);
  },

  /**
   * Get all available credit packages
   */
  getCreditPackages: async (): Promise<CreditPackagesResponse> => {
    return httpClient.get<CreditPackagesResponse>(`${API_ENDPOINT}/packages`);
  },

  /**
   * Get the costs of all credit actions
   */
  getCreditCosts: async (): Promise<CreditCostsResponse> => {
    return httpClient.get<CreditCostsResponse>(`${API_ENDPOINT}/costs`);
  },

  /**
   * Purchase a credit package
   */
  purchaseCreditPackage: async (
    packageId: string,
    request: PurchasePackageRequest,
  ): Promise<PurchasePackageResponse> => {
    return httpClient.post<PurchasePackageResponse>(
      `${API_ENDPOINT}/packages/${packageId}/purchase`,
      request,
    );
  },

  /**
   * Check if the user has enough credits for an action
   */
  checkActionAvailability: async (
    actionType: ActionType,
    amount?: number,
  ): Promise<CheckActionResponse> => {
    let url = `${API_ENDPOINT}/check-action/${actionType}`;
    if (amount !== undefined) {
      url += `?amount=${amount}`;
    }

    return httpClient.get<CheckActionResponse>(url);
  },
};
