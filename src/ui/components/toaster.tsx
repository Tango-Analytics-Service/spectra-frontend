import Toast from "@/ui/components/toast/Toast";
import ToastClose from "@/ui/components/toast/ToastClose";
import ToastDescription from "@/ui/components/toast/ToastDescription";
import { ToastProvider } from "@/ui/components/toast";
import ToastTitle from "@/ui/components/toast/ToastTitle";
import ToastViewport from "@/ui/components/toast/ToastViewport";
import { useToast } from "@/ui/components/use-toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function({ id, title, description, action, ...props }) {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>{description}</ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
