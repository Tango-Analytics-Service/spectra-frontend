import { apiFetch } from "@/lib/apiFetch";
import { ActionType, CreditBalance } from "@/credits/types";
import {
    CheckActionResponse,
    CreditCostsResponse,
    CreditPackagesResponse,
    CreditTransactionsRequest,
    CreditTransactionsResponse,
    PurchasePackageRequest,
    PurchasePackageResponse,
} from "@/credits/api/types";

const API_ENDPOINT = "/credits";

/** Get user's credit balance */
export function getCreditBalance() {
    return apiFetch<CreditBalance>(`${API_ENDPOINT}/balance`);
}

/** Get user's credit transactions with optional filtering */
export function getCreditTransactions(data?: CreditTransactionsRequest) {
    return apiFetch<CreditTransactionsResponse>(`${API_ENDPOINT}/transactions`, {
        params: {
            limit: data?.limit ?? 50,
            offset: data?.offset ?? 0,
            start_date: data?.startDate,
            end_date: data?.endDate,
            action_types: data?.actionTypes,
        },
    });
}

/** Get all available credit packages */
export function getCreditPackages() {
    return apiFetch<CreditPackagesResponse>(`${API_ENDPOINT}/packages`);
}

/** Get the costs of all credit actions */
export function getCreditCosts() {
    return apiFetch<CreditCostsResponse>(`${API_ENDPOINT}/costs`);
}

/** Purchase a credit package */
export function purchaseCreditPackage(id: string, request: PurchasePackageRequest) {
    return apiFetch<PurchasePackageResponse>(`${API_ENDPOINT}/packages/${id}/purchase`, {
        method: "POST",
        body: request,
    });
}

/** Check if the user has enough credits for an action */
export function checkActionAvailability(actionType: ActionType, amount?: number) {
    return apiFetch<CheckActionResponse>(`${API_ENDPOINT}/check-action/${actionType}`, {
        params: {
            amount,
        },
    });
}
