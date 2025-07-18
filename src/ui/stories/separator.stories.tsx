// [build] library: 'shadcn'
import { Separator } from "@/ui/components/separator";

const meta = {
    title: "ui/Separator",
    component: Separator,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => (
        <div>
            <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    An open-source UI component library.
                </p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-sm">
                <div>Blog</div>
                <Separator orientation="vertical" />
                <div>Docs</div>
                <Separator orientation="vertical" />
                <div>Source</div>
            </div>
        </div>
    ),
    args: {},
};
