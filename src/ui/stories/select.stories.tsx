// [build] library: 'shadcn'
import { Select, SelectGroup, SelectValue } from "@/ui/components/select";
import SelectContent from "@/ui/components/select/SelectContent";
import SelectItem from "@/ui/components/select/SelectItem";
import SelectSeparator from "@/ui/components/select/SelectSeparator";
import SelectTrigger from "@/ui/components/select/SelectTrigger";
import SelectLabel from "@/ui/components/select/SelectLabel";

const meta = {
    title: "ui/Select",
    component: Select,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Vegetables</SelectLabel>
                    <SelectItem value="aubergine">Aubergine</SelectItem>
                    <SelectItem value="broccoli">Broccoli</SelectItem>
                    <SelectItem value="carrot" disabled>
                        Carrot
                    </SelectItem>
                    <SelectItem value="courgette">Courgette</SelectItem>
                    <SelectItem value="leek">Leek</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Meat</SelectLabel>
                    <SelectItem value="beef">Beef</SelectItem>
                    <SelectItem value="chicken">Chicken</SelectItem>
                    <SelectItem value="lamb">Lamb</SelectItem>
                    <SelectItem value="pork">Pork</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
    args: {},
};
