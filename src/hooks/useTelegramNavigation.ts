// src/hooks/useTelegramNavigation.ts
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isTelegramWebApp, getTelegramWebApp } from "../utils/telegramWebApp";

export const useTelegramNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isTelegramWebApp()) return;

        const tg = getTelegramWebApp();
        const backButton = tg.BackButton;

        const handleBackClick = () => {
            navigate(-1); // Возврат на предыдущую страницу
        };

        // Показывать кнопку "Назад" только если не на главной странице
        if (location.pathname !== "/" && location.pathname !== "/home") {
            backButton.onClick(handleBackClick);
            backButton.show();
        } else {
            backButton.hide();
        }

        return () => {
            backButton.offClick(handleBackClick); // Очищаем обработчик при размонтировании
        };
    }, [location.pathname, navigate]);
};
