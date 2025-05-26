// src/lib/design-system.ts
import { cn } from "./utils";

// Цветовая палитра
export const colors = {
  // Основные цвета
  primary: {
    50: "#e6f2ff",
    100: "#bae0ff",
    200: "#7cc4ff",
    300: "#36a3ff",
    400: "#1890ff",
    500: "#1677ff", // основной синий
    600: "#0958d9",
    700: "#003eb3",
    800: "#002c8c",
    900: "#001d66",
  },

  // Фоновые цвета
  background: {
    primary: "#0F172A", // основной темный фон
    secondary: "#131c2e", // вторичный темный фон
    card: "rgba(30, 41, 59, 0.5)", // фон карточек
    overlay: "rgba(15, 23, 42, 0.8)", // оверлей
  },

  // Статусные цвета
  success: {
    light: "#52c41a",
    main: "#389e0d",
    dark: "#237804",
    bg: "rgba(82, 196, 26, 0.1)",
  },

  warning: {
    light: "#faad14",
    main: "#d48806",
    dark: "#ad6800",
    bg: "rgba(250, 173, 20, 0.1)",
  },

  error: {
    light: "#ff4d4f",
    main: "#cf1322",
    dark: "#820014",
    bg: "rgba(255, 77, 79, 0.1)",
  },

  // Нейтральные цвета
  neutral: {
    0: "#ffffff",
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e8e8e8",
    300: "#d9d9d9",
    400: "#bfbfbf",
    500: "#8c8c8c",
    600: "#595959",
    700: "#434343",
    800: "#262626",
    900: "#1f1f1f",
  },
};

// Отступы (используем стандартные значения Tailwind)
export const spacing = {
  xs: "1", // 4px
  sm: "2", // 8px
  md: "4", // 16px
  lg: "6", // 24px
  xl: "8", // 32px
  "2xl": "12", // 48px
  "3xl": "16", // 64px
} as const;

// Радиусы скругления (используем стандартные значения Tailwind)
export const radius = {
  sm: "sm", // 4px
  md: "md", // 8px
  lg: "lg", // 12px
  xl: "xl", // 16px
  full: "full", // 9999px
} as const;

// Тени
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  glow: "0 0 20px rgba(22, 119, 255, 0.3)",
} as const;

// Типографика
export const typography = {
  // Размеры заголовков
  h1: "text-2xl sm:text-3xl font-bold",
  h2: "text-xl sm:text-2xl font-semibold",
  h3: "text-lg sm:text-xl font-semibold",
  h4: "text-base sm:text-lg font-medium",

  // Размеры текста
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm",
  tiny: "text-xs",

  // Вес шрифта
  weight: {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
} as const;

// Градиенты
export const gradients = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-500",
  primaryHover: "bg-gradient-to-r from-blue-700 to-blue-600",
  background: "bg-gradient-to-br from-[#0F172A] to-[#131c2e]",
  card: "bg-gradient-to-br from-slate-800/50 to-slate-900/50",
  success: "bg-gradient-to-r from-green-500 to-green-600",
  warning: "bg-gradient-to-r from-amber-500 to-amber-600",
  error: "bg-gradient-to-r from-red-500 to-red-600",
} as const;

// Утилиты для создания классов отступов
export const spacingClasses = {
  p: {
    xs: `p-${spacing.xs}`,
    sm: `p-${spacing.sm}`,
    md: `p-${spacing.md}`,
    lg: `p-${spacing.lg}`,
    xl: `p-${spacing.xl}`,
    "2xl": `p-${spacing["2xl"]}`,
    "3xl": `p-${spacing["3xl"]}`,
  },
  px: {
    xs: `px-${spacing.xs}`,
    sm: `px-${spacing.sm}`,
    md: `px-${spacing.md}`,
    lg: `px-${spacing.lg}`,
    xl: `px-${spacing.xl}`,
    "2xl": `px-${spacing["2xl"]}`,
    "3xl": `px-${spacing["3xl"]}`,
  },
  py: {
    xs: `py-${spacing.xs}`,
    sm: `py-${spacing.sm}`,
    md: `py-${spacing.md}`,
    lg: `py-${spacing.lg}`,
    xl: `py-${spacing.xl}`,
    "2xl": `py-${spacing["2xl"]}`,
    "3xl": `py-${spacing["3xl"]}`,
  },
  mt: {
    xs: `mt-${spacing.xs}`,
    sm: `mt-${spacing.sm}`,
    md: `mt-${spacing.md}`,
    lg: `mt-${spacing.lg}`,
    xl: `mt-${spacing.xl}`,
    "2xl": `mt-${spacing["2xl"]}`,
    "3xl": `mt-${spacing["3xl"]}`,
  },
  mb: {
    xs: `mb-${spacing.xs}`,
    sm: `mb-${spacing.sm}`,
    md: `mb-${spacing.md}`,
    lg: `mb-${spacing.lg}`,
    xl: `mb-${spacing.xl}`,
    "2xl": `mb-${spacing["2xl"]}`,
    "3xl": `mb-${spacing["3xl"]}`,
  },
  gap: {
    xs: `gap-${spacing.xs}`,
    sm: `gap-${spacing.sm}`,
    md: `gap-${spacing.md}`,
    lg: `gap-${spacing.lg}`,
    xl: `gap-${spacing.xl}`,
    "2xl": `gap-${spacing["2xl"]}`,
    "3xl": `gap-${spacing["3xl"]}`,
  },
} as const;

// Утилиты для создания классов радиусов
export const radiusClasses = {
  sm: `rounded-${radius.sm}`,
  md: `rounded-${radius.md}`,
  lg: `rounded-${radius.lg}`,
  xl: `rounded-${radius.xl}`,
  full: `rounded-${radius.full}`,
} as const;

// Стили компонентов
export const components = {
  // Карточки
  card: {
    base: cn(
      radiusClasses.xl,
      "border backdrop-blur-sm transition-all duration-200",
      "bg-slate-800/50 border-blue-500/20 text-white",
    ),
    hover: "hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5",
    gradient: cn(
      radiusClasses.xl,
      "border backdrop-blur-sm",
      "bg-gradient-to-br from-slate-800/50 to-slate-900/50",
      "border-blue-500/20 text-white",
    ),
  },

  // Кнопки
  button: {
    base: "font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
    primary: cn(
      gradients.primary,
      "text-white shadow-md hover:shadow-lg",
      gradients.primaryHover,
    ),
    secondary: cn(
      "bg-slate-800/50 text-blue-300 border border-blue-500/20",
      "hover:bg-slate-700/50 hover:border-blue-500/30",
    ),
    ghost: "text-gray-400 hover:text-white hover:bg-slate-800/50",
    danger: cn(
      "bg-red-500/10 text-red-400 border border-red-500/20",
      "hover:bg-red-500/20 hover:border-red-500/30",
    ),
  },

  // Инпуты
  input: {
    base: cn(
      "w-full transition-all duration-200",
      radiusClasses.md,
      "bg-slate-900/70 border border-blue-500/20 text-white",
      "placeholder:text-gray-500",
      "focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20",
    ),
  },

  // Бейджи
  badge: {
    base: cn(
      "inline-flex items-center gap-1 text-xs font-medium",
      spacingClasses.px.sm,
      "py-0.5",
      radiusClasses.full,
    ),
    primary: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border border-red-500/20",
  },

  // Скелетоны
  skeleton: {
    base: cn("animate-pulse bg-slate-800/50", radiusClasses.md),
    text: "h-4 w-full rounded",
    title: "h-6 w-3/4 rounded",
    card: cn("h-32 w-full", radiusClasses.xl),
  },
} as const;

// Анимации
export const animations = {
  fadeIn: "animate-in fade-in duration-200",
  fadeOut: "animate-out fade-out duration-200",
  slideIn: "animate-in slide-in-from-bottom-2 duration-200",
  slideOut: "animate-out slide-out-to-top-2 duration-200",
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-200",
} as const;

// Утилиты для создания консистентных стилей
export const createCardStyle = (
  variant: "default" | "gradient" = "default",
) => {
  return variant === "gradient"
    ? components.card.gradient
    : components.card.base;
};

export const createButtonStyle = (
  variant: keyof typeof components.button = "primary",
) => {
  return cn(components.button.base, components.button[variant]);
};

export const createBadgeStyle = (
  variant: keyof typeof components.badge = "primary",
) => {
  return cn(components.badge.base, components.badge[variant]);
};
