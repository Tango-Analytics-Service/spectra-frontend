import { ResizablePanel } from "@/ui/components/resizable";
import ResizableHandle from "@/ui/components/resizable/ResizableHandle";
import ResizablePanelGroup from "@/ui/components/resizable/ResizablePanelGroup";

const meta = {
    title: "ui/ResizablePanelGroup",
    component: ResizablePanelGroup,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => (
        <ResizablePanelGroup
            {...args}
            direction="horizontal"
            className="max-w-md rounded-lg border"
        >
            <ResizablePanel defaultSize={50}>
                <div className="flex h-[200px] items-center justify-center p-6">
                    <span className="font-semibold">One</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={25}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Two</span>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={75}>
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Three</span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
    args: {},
};
