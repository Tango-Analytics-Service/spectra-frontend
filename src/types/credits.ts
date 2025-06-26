// src/types/credits.ts
export enum ActionType {
    CREATE_CHANNEL_SET = "CREATE_CHANNEL_SET",
    ADD_CHANNEL = "ADD_CHANNEL",
    ANALYZE_CHANNEL_SET = "ANALYZE_CHANNEL_SET",
    GENERATE_REPORT = "GENERATE_REPORT",
    EXPORT_DATA = "EXPORT_DATA",
    PACKAGE_PURCHASE = "PACKAGE_PURCHASE",
    ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT",
    REFERRAL_BONUS = "REFERRAL_BONUS",
}

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
