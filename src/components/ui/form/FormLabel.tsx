import React from "react";
import { Root } from "@radix-ui/react-label";
import { useFormField } from ".";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const FormLabel = React.forwardRef<
    React.ElementRef<typeof Root>,
    React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && "text-destructive", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
});
FormLabel.displayName = "FormLabel";

export default FormLabel;
