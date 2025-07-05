// [build] library: 'shadcn'
import { Button } from "@/ui/components/button";
import { Dialog, DialogTrigger } from "@/ui/components/dialog";
import DialogContent from "@/ui/components/dialog/DialogContent";
import DialogDescription from "@/ui/components/dialog/DialogDescription";
import DialogFooter from "@/ui/components/dialog/DialogFooter";
import DialogHeader from "@/ui/components/dialog/DialogHeader";
import DialogTitle from "@/ui/components/dialog/DialogTitle";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";

const meta = {
    title: "ui/Dialog",
    component: Dialog,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
    args: {},
};
