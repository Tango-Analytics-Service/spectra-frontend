// [build] library: 'shadcn'
import { Sheet, SheetTrigger } from "@/ui/components/sheet";
import SheetContent from "@/ui/components/sheet/SheetContent";
import SheetDescription from "@/ui/components/sheet/SheetDescription";
import SheetHeader from "@/ui/components/sheet/SheetHeader";
import SheetTitle from "@/ui/components/sheet/SheetTitle";

const meta = {
    title: "ui/Sheet",
    component: Sheet,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Default = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => {
        return (
            <Sheet>
                <SheetTrigger>Open Right</SheetTrigger>
                <SheetContent side={args.side}>
                    <SheetHeader>
                        <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        );
    },
    args: {
        side: "right",
    },
};

export const Left = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => {
        return (
            <Sheet>
                <SheetTrigger>Open Left</SheetTrigger>
                <SheetContent side={args.side}>
                    <SheetHeader>
                        <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        );
    },
    args: {
        side: "left",
    },
};

export const Top = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => {
        return (
            <Sheet>
                <SheetTrigger>Open Top</SheetTrigger>
                <SheetContent side={args.side}>
                    <SheetHeader>
                        <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        );
    },
    args: {
        side: "top",
    },
};

export const Bottom = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => {
        return (
            <Sheet>
                <SheetTrigger>Open Bottom</SheetTrigger>
                <SheetContent side={args.side}>
                    <SheetHeader>
                        <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        );
    },
    args: {
        side: "bottom",
    },
};
