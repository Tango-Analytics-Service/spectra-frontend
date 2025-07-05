// [build] library: 'shadcn'
import { Progress } from "@/ui/components/progress";

const meta = {
    title: "ui/Progress",
    component: Progress,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => <Progress value={33} />,
    args: {},
};
