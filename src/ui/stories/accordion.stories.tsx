// [build] library: 'shadcn'
import { Accordion } from "@/ui/components/accordion";
import AccordionContent from "@/ui/components/accordion/AccordionContent";
import AccordionItem from "@/ui/components/accordion/AccordionItem";
import AccordionTrigger from "@/ui/components/accordion/AccordionTrigger";

const meta = {
    title: "ui/Accordion",
    component: Accordion,
    tags: ["autodocs"],
    argTypes: {},
};

export default meta;

export const Base = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => (
        <Accordion {...args}>
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that matches the other components&apos;
                    aesthetic.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                    Yes. It&apos;s animated by default, but you can disable it if you prefer.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    args: {
        type: "single",
        collapsible: true,
    },
};
