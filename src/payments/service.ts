import { httpClient } from "@/lib/httpClient";

const API_ENDPOINT = "/payments";

export interface InitiatePurchaseRequest {
    package_id: string;
    payment_methods?: string[];
    return_url?: string;
}

export interface InitiatePurchaseResponse {
    success: boolean;
    payment_id: string;
    payment_url: string;
    amount: number;
    currency: string;
    package: {
        id: string;
        name: string;
        credits: number;
    };
}

export const paymentsService = {
    /**
     * Initiate a purchase for a credit package
     */
    initiatePurchase: (
        data: InitiatePurchaseRequest,
    ): Promise<InitiatePurchaseResponse> => {
        return httpClient.post<InitiatePurchaseResponse>(
            `${API_ENDPOINT}/initiate`,
            data,
        );
    },
};