export interface PaymentPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    [key: string]: any;
}

export interface PaymentInfo {
    payment_id: string;
    external_payment_id: string;
    amount: number;
    currency: string;
    expires_at?: string;
    package: PaymentPackage;
}