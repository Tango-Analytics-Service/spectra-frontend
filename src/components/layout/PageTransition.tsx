import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.3,
            }}
        >
            {children}
        </motion.div>
    );
}
