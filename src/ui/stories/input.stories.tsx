/* eslint-disable @typescript-eslint/no-explicit-any */
// [build] library: 'shadcn'
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";

const meta = {
    title: "ui/Input",
    component: Input,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Default = {
    render: (args: any) => <Input {...args} />,
    args: {
        type: "email",
        placeholder: "Email",
    },
};
export const Disabled = {
    render: (args: any) => <Input disabled {...args} />,
    args: { ...Default.args },
};
export const WithLabel = {
    render: (args: any) => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">{args.placeholder}</Label>
            <Input {...args} id="email" />
        </div>
    ),
    args: { ...Default.args },
};
export const WithText = {
    render: (args: any) => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email-2">{args.placeholder}</Label>
            <Input {...args} id="email-2" />
            <p className="text-sm text-slate-500">Enter your email address.</p>
        </div>
    ),
    args: { ...Default.args },
};
export const WithButton = {
    render: (args: any) => (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input {...args} />
            <Button type="submit">Subscribe</Button>
        </div>
    ),
    args: { ...Default.args },
};
