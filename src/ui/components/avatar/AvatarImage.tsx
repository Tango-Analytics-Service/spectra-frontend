import React from "react";
import { Image } from "@radix-ui/react-avatar";
import { cn } from "@/lib/cn";

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof Image>,
    React.ComponentPropsWithoutRef<typeof Image>
>(({ className, ...props }, ref) => (
    <Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName ="AvatarImage";

export default AvatarImage;
