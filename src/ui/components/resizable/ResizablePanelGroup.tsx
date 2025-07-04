import { PanelGroup } from "react-resizable-panels";
import { cn } from "@/lib/cn";

export default function ResizablePanelGroup({
    className,
    ...props
}: React.ComponentProps<typeof PanelGroup>) {
    return <PanelGroup
        className={cn(
            "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
            className
        )}
        {...props}
    />;
}
