// [build] library: 'shadcn'
import { Label } from "@/ui/components/label";

const meta = {
    title: "ui/Label",
    component: Label,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => <Label htmlFor="email">Your email address</Label>,
    args: {},
};
