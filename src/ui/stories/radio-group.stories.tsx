// [build] library: 'shadcn'
import { Label } from "@/ui/components/label";
import RadioGroup from "@/ui/components/radio-group/RadioGroup";
import RadioGroupItem from "@/ui/components/radio-group/RadioGroupItem";

const meta = {
    title: "ui/RadioGroup",
    component: RadioGroup,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => (
        <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r3" />
                <Label htmlFor="r3">Compact</Label>
            </div>
        </RadioGroup>
    ),
    args: {},
};
