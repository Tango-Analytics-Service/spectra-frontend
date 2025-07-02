import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerTrigger } from "@/components/ui/drawer";
import Drawer from "@/components/ui/drawer/Drawer";
import DrawerContent from "@/components/ui/drawer/DrawerContent";
import DrawerDescription from "@/components/ui/drawer/DrawerDescription";
import DrawerFooter from "@/components/ui/drawer/DrawerFooter";
import DrawerHeader from "@/components/ui/drawer/DrawerHeader";
import DrawerTitle from "@/components/ui/drawer/DrawerTitle";

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
