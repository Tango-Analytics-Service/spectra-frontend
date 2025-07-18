/* eslint-disable @typescript-eslint/no-explicit-any */
// [build] library: 'shadcn'
import { Badge } from "@/ui/components/badge";

const meta = {
    title: "ui/Badge",
    component: Badge,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: (args: any) => <Badge {...args}>Badge</Badge>,
    args: {},
};
export const Secondary = {
    render: (args: any) => <Badge {...args}>Secondary</Badge>,
    args: {
        variant: "secondary",
    },
};
export const Outline = {
    render: (args: any) => <Badge {...args}>Outline</Badge>,
    args: {
        variant: "outline",
    },
};
export const Destructive = {
    render: (args: any) => <Badge {...args}>Destructive</Badge>,
    args: {
        variant: "destructive",
    },
};
