import { create } from "zustand";
import { toast } from "@/ui/components/use-toast";
import { paymentsService, InitiatePurchaseRequest } from "@/payments/service";
import { LoadStatus } from "@/lib/types";
import { isTelegramWebApp, getTelegramWebApp } from "@/telegram/utils";

interface PaymentsStoreState {
    loadStatus: LoadStatus;
    currentPaymentId: string | null;
    
    // Methods
    initiatePurchase: (request: InitiatePurchaseRequest) => Promise<boolean>;
    openPaymentUrl: (url: string) => void;
}

export const usePaymentsStore = create<PaymentsStoreState>((set, get) => ({
    loadStatus: "idle",
    currentPaymentId: null,

    initiatePurchase: async (request: InitiatePurchaseRequest) => {
        set({ loadStatus: "pending" });
        
        try {
            const response = await paymentsService.initiatePurchase(request);
            
            if (response.success) {
                set({ 
                    loadStatus: "success",
                    currentPaymentId: response.payment_id 
                });
                
                toast({
                    title: "Переход к оплате",
                    description: `Инициирована оплата пакета "${response.package.name}" на сумму ${response.amount} ${response.currency}`,
                });
                
                // Открываем ссылку для оплаты
                get().openPaymentUrl(response.payment_url);
                
                return true;
            } else {
                throw new Error("Failed to initiate payment");
            }
        } catch (error) {
            console.error("Error initiating purchase:", error);
            set({ loadStatus: "error" });
            
            toast({
                title: "Ошибка",
                description: "Не удалось инициировать платеж. Попробуйте позже.",
                variant: "destructive",
            });
            
            return false;
        } finally {
            setTimeout(() => {
                set({ loadStatus: "idle" });
            }, 2000);
        }
    },

    openPaymentUrl: (url: string) => {
        if (!isTelegramWebApp()) {
            // Для веб-браузера просто открываем в новой вкладке
            window.open(url, "_blank");
            return;
        }

        try {
            const tg = getTelegramWebApp();
            
            // Пробуем определить, что за ссылка и какой метод использовать
            if (url.includes("t.me/") || url.includes("telegram.")) {
                // Telegram ссылка
                tg.openTelegramLink(url);
            } else if (url.includes("invoice") || url.includes("payment")) {
                // Возможно это invoice
                tg.openInvoice(url, (status) => {
                    console.log("Invoice status:", status);
                    if (status === "paid") {
                        toast({
                            title: "Платеж завершен",
                            description: "Проверяем статус платежа...",
                        });
                        // Здесь можно обновить баланс
                    }
                });
            } else {
                // Обычная внешняя ссылка
                tg.openLink(url, { try_instant_view: false });
            }
        } catch (error) {
            console.error("Error opening payment URL:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось открыть ссылку для оплаты",
                variant: "destructive",
            });
        }
    },
}));