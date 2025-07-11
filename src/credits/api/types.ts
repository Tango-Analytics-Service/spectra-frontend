import {
    CreditCost,
    CreditPackage,
    CreditTransaction,
    PackageInfo,
    PaymentInfo,
} from "@/credits/types";

export interface CreditTransactionsRequest {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    actionTypes?: string[];
}

export interface PurchasePackageRequest {
    payment_method: string;
    payment_details?: unknown;
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
