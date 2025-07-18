import React from "react";
import { useFormField } from ".";
import { cn } from "@/lib/cn";

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn("text-[0.8rem] font-medium text-destructive", className)}
            {...props}
        >
            {body}
        </p>
    );
});
FormMessage.displayName = "FormMessage";

export default FormMessage;

