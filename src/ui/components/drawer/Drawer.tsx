import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

export default function Drawer({
    shouldScaleBackground = true,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
    return <DrawerPrimitive.Root
        shouldScaleBackground={shouldScaleBackground}
        {...props}
    />;
}
