// [build] library: 'shadcn'
import { Slider } from "@/ui/components/slider";

const meta = {
    title: "ui/Slider",
    component: Slider,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    args: {
        defaultValue: [33],
        max: 100,
        step: 1,
    },
};
