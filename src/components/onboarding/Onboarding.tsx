import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/ui/components/button";
import { cn } from "@/lib/cn";
import { createButtonStyle, gradients, typography } from "@/lib/design-system";

const onboardingSteps = [
    {
        title: "Добро пожаловать в Spectra!",
        text: "Мы поможем с подбором каналов для рекламы. Листайте дальше, чтобы познакомиться с инструкцией",
    },
    {
        title: "Сформулируйте свой запрос",
        text: "Для наилучшего результата: \n\n1. Продумайте запрос на поиск каналов. Какие они должны быть? \n2. Запишите в строке. Чем точнее, тем более персонализированный контент будет! \n\n\nP.S. Используйте примеры, как подсказку",
    },
    {
        title: "Исследуйте функции",
        text: "Очень важно не только сформулировать запрос, но и настроить параметры поиска: \n\n– Сколько каналов Вам нужно? \n– Какое количество подписчиков в канале Вас интересует? \n– Какая категория каналов Вам нужна?",
    },
    {
        title: "Начните прямо сейчас!",
        text: "Готовы сделать первый свой запрос? Нажмите на поисковую строку и наслаждайтесь результатом! Определим, какие каналы прошли проверку, а какие нет",
    },
];

interface OnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
    showSkipButton: boolean;
}

export default function Onboarding({
    onComplete,
    onSkip,
    showSkipButton,
}: OnboardingProps) {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < onboardingSteps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const currentStep = onboardingSteps[step];

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex flex-col items-center justify-center text-white text-center",
                gradients.background,
                "p-4",
            )}
        >
            <div className="max-w-md w-full flex flex-col items-center px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-xs flex flex-col items-center" // ограничиваем ширину
                    >
                        <h1 className={cn(typography.h1, "mb-4 text-center")}>
                            {currentStep.title}
                        </h1>
                        <p
                            className={cn(
                                typography.body,
                                "text-blue-200 mb-12 text-left", // выравниваем текст
                            )}
                            style={{ whiteSpace: "pre-line" }}
                        >
                            {currentStep.text}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <Button
                    onClick={handleNext}
                    className={cn(createButtonStyle("primary"), "w-full max-w-xs")}
                >
                    {step < onboardingSteps.length - 1 ? "Далее" : "Начать работу"}
                </Button>

                {showSkipButton && (
                    <Button
                        onClick={onSkip}
                        variant="link"
                        className="mt-4 text-slate-400 hover:text-white"
                    >
                        Пропустить
                    </Button>
                )}
            </div>
        </div>
    );
}
