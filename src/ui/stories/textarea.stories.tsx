/* eslint-disable @typescript-eslint/no-explicit-any */
// [build] library: 'shadcn'
import { Button } from "@/ui/components/button";
import { Label } from "@/ui/components/label";
import { Textarea } from "@/ui/components/textarea";

const meta = {
    title: "ui/Textarea",
    component: Textarea,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Default = {
    render: (args: any) => <Textarea {...args} />,
    args: {
        placeholder: "Type your message here.",
    },
};

export const Disabled = {
    render: (args: any) => <Textarea {...args} />,
    args: {
        ...Default.args,
        disabled: true,
    },
};

export const WithLabel = {
    render: (args: any) => (
        <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your message</Label>
            <Textarea {...args} id="message" />
        </div>
    ),
    args: { ...Default.args },
};

export const WithText = {
    render: (args: any) => (
        <div className="grid w-full gap-1.5">
            <Label htmlFor="message-2">Your Message</Label>
            <Textarea {...args} id="message-2" />
            <p className="text-sm text-slate-500">
                Your message will be copied to the support team.
            </p>
        </div>
    ),
    args: { ...Default.args },
};

export const WithButton = {
    render: (args: any) => (
        <div className="grid w-full gap-2">
            <Textarea {...args} />
            <Button>Send message</Button>
        </div>
    ),
    args: { ...Default.args },
};
