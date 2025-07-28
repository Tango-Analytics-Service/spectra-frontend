import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Dialog } from "@/ui/components/dialog";
import ChannelsSetCard from "@/channels-sets/components/ChannelsSetCard";
import AnalysisConfirmDialog from "@/channels-sets/components/AnalysisConfirmDialog";
import AddChannelsDialog from "@/channels-sets/components/AddChannelsDialog";
import CreateSmartSetDialog from "@/channels-sets/components/CreateSmartSetDialog";
import LoadingCard from "@/ui/components/loading/LoadingCard";
import CenteredAppHeader from "@/components/common/ChannelSetsHeader";
import {
    createCardStyle,
    createTextStyle,
    spacing,
    typography,
    gradients,
    textColors,
    components,
    animations,
    createButtonStyle,
} from "@/lib/design-system";
import { cn } from "@/lib/cn";
import { ChannelsSet } from "@/channels-sets/types";
import { useChannelsSetsStore } from "@/channels-sets/stores/useChannelsSetsStore";
import CreateSearchDialog from "@/search/components/CreateSearchDialog";
import { Textarea } from "@/ui/components/textarea";

const searchExamples = [
    "Хочу разрекламировать пылесос",
    "Нужны каналы про инвестиции, без крипты и рекламы",
    "Найди мне блоги о путешествиях с хорошим охватом",
];

export default function ChannelSetPage() {
    const navigate = useNavigate();

    const channelsSets = useChannelsSetsStore((s) => s.channelsSets);
    const loadStatus = useChannelsSetsStore((s) => s.loadStatus);
    const fetchChannelsSets = useChannelsSetsStore((s) => s.fetchChannelsSets);

    // поиск
    const [searchQuery, setSearchQuery] = useState("");
    const [dialogQuery, setDialogQuery] = useState("");

    // создание умного набора
    const [isCreateSmartSetOpen, setIsCreateSmartSetOpen] = useState(false);

    // Анализ / добавление
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
    const [selectedSetForAnalysis, setSelectedSetForAnalysis] = useState<ChannelsSet>();
    const [addChannelsDialogOpen, setAddChannelsDialogOpen] = useState(false);
    const [selectedSetForChannels, setSelectedSetForChannels] = useState<ChannelsSet | null>(null);

    const searchQueryRef = useRef(searchQuery);

    useEffect(() => {
        fetchChannelsSets();
    }, [fetchChannelsSets]);

    useEffect(() => {
        searchQueryRef.current = searchQuery;
    }, [searchQuery]);

    // Для анимации печати примеров поиска
    const [currentExampleIdx, setCurrentExampleIdx] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = searchExamples[currentExampleIdx];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && displayedText.length < currentText.length) {
            // Печатаем букву
            timeout = setTimeout(() => {
                setDisplayedText(currentText.slice(0, displayedText.length + 1));
            }, 60);
        } else if (!isDeleting && displayedText.length === currentText.length) {
            // Пауза после полного текста
            timeout = setTimeout(() => setIsDeleting(true), 1200);
        } else if (isDeleting && displayedText.length > 0) {
            // Стираем букву
            timeout = setTimeout(() => {
                setDisplayedText(currentText.slice(0, displayedText.length - 1));
            }, 30);
        } else if (isDeleting && displayedText.length === 0) {
            // Переход к следующему примеру
            timeout = setTimeout(() => {
                setIsDeleting(false);
                setCurrentExampleIdx((prev) => (prev + 1) % searchExamples.length);
            }, 300);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentExampleIdx]);

    const handleFind = () => {
    // открываем диалог «умного» набора
        setDialogQuery(searchQueryRef.current);
        setIsCreateSmartSetOpen(true);
    };

    const handleAnalyze = (setId: string) => {
        const s = channelsSets.find((c) => c.id === setId);
        if (s) {
            setSelectedSetForAnalysis(s);
            setAnalysisDialogOpen(true);
        }
    };
    const handleConfirmAnalysis = async (setId: string) => {
    // тут ваша логика запуска анализа
        await new Promise((r) => setTimeout(r, 1000));
    };
    const handleViewDetails = (setId: string) => {
        navigate(`/channel-sets/${setId}`);
    };
    const handleAddChannels = (setId: string) => {
        const s = channelsSets.find((c) => c.id === setId);
        if (s) {
            setSelectedSetForChannels(s);
            setAddChannelsDialogOpen(true);
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col w-full min-h-screen",
                gradients.background,
                "text-white"
            )}
        >
            
            <CenteredAppHeader />
            <main
                className={cn(
                    "flex-1 overflow-hidden flex flex-col",
                    `px-${spacing.md} sm:px-${spacing.lg}`,
                    `pb-${spacing.md} sm:pb-${spacing.lg}`
                )}
            >
                <div className={`mt-${spacing.sm} sm:mt-${spacing.md}`}>
                    {/* <h1 className={cn(typography.h1, "text-center")}>Добро пожаловать!</h1> */}
                    <p
                        className={cn(
                            createTextStyle("body", "secondary"),
                            "mt-1",
                            "text-center"
                        )}
                    >
                        Подберем каналы под любые Ваши задачи
                    </p>
                </div>

                {/* Поиск + Найти */}
                <div className={`mt-${spacing.md}`}>
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-400"
                        />
                        <Textarea
                            placeholder="Ваш запрос"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(components.input.base, "pl-9")}
                        />
                    </div>

                    <Button
                        onClick={handleFind}
                        className={cn(
                            createButtonStyle("primary"),
                            `mt-${spacing.md}`,
                            "w-full py-3"
                        )}
                    >
                        Найти
                    </Button>

                    <div className={`mt-${spacing.md}`}>
                        <p
                            className={cn(
                                createTextStyle("h4", "primary"),
                                "mb-2"
                            )}
                        >
                            Часто ищут:
                        </p>
                        <div
                            className={cn(
                                createTextStyle("h2"), // Очень крупно
                                "text-gray-400 min-h-[2.5em] text-left"
                            )}
                            style={{ letterSpacing: "0.01em", minHeight: "2.5em" }}
                        >
                            {displayedText}
                            <span className="animate-pulse">|</span>
                        </div>
                    </div>
                </div>

                {/* Список наборов */}
                {/* <div className={`mt-${spacing.lg} flex-1`}>
                    {loadStatus === "pending" ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <LoadingCard key={i} text="Загрузка наборов..." />
                            ))}
                        </div>
                    ) : (
                        channelsSets.map((set) => (
                            <ChannelsSetCard
                                key={set.id}
                                channelSet={set}
                                onAnalyze={handleAnalyze}
                                onViewDetails={handleViewDetails}
                                onAddChannels={handleAddChannels}
                            />
                        ))
                    )}
                </div> */}
            </main>

            {/* Диалог создания умного набора */}
            <CreateSearchDialog
                open={isCreateSmartSetOpen}
                onOpenChange={setIsCreateSmartSetOpen}
                initialQuery={dialogQuery}
            />

            {/* Диалог подтверждения анализа */}
            <AnalysisConfirmDialog
                open={analysisDialogOpen}
                onOpenChange={setAnalysisDialogOpen}
                channelSet={selectedSetForAnalysis}
                onConfirm={handleConfirmAnalysis}
            />

            {/* Диалог добавления каналов */}
            <AddChannelsDialog
                open={addChannelsDialogOpen}
                onOpenChange={setAddChannelsDialogOpen}
                setId={selectedSetForChannels?.id || ""}
                existingChannels={
                    selectedSetForChannels?.channels?.map((ch) => ch.username) || []
                }
            />
        </div>
    );
}
