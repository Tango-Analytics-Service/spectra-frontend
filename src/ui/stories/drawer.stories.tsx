import { Button } from "@/ui/components/button";
import { DrawerClose, DrawerTrigger } from "@/ui/components/drawer";
import Drawer from "@/ui/components/drawer/Drawer";
import DrawerContent from "@/ui/components/drawer/DrawerContent";
import DrawerDescription from "@/ui/components/drawer/DrawerDescription";
import DrawerFooter from "@/ui/components/drawer/DrawerFooter";
import DrawerHeader from "@/ui/components/drawer/DrawerHeader";
import DrawerTitle from "@/ui/components/drawer/DrawerTitle";

const meta = {
    title: "ui/Drawer",
    component: Drawer,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => (
        <Drawer {...args}>
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
    args: {},
};
