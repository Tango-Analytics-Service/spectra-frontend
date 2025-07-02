// [build] library: 'shadcn'
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AlertDialogAction from "@/components/ui/alert-dialog/AlertDialogAction";
import AlertDialogCancel from "@/components/ui/alert-dialog/AlertDialogCancel";
import AlertDialogContent from "@/components/ui/alert-dialog/AlertDialogContent";
import AlertDialogDescription from "@/components/ui/alert-dialog/AlertDialogDescription";
import AlertDialogFooter from "@/components/ui/alert-dialog/AlertDialogFooter";
import AlertDialogHeader from "@/components/ui/alert-dialog/AlertDialogHeader";
import AlertDialogTitle from "@/components/ui/alert-dialog/AlertDialogTitle";
import { Button } from "@/components/ui/button";

const meta = {
    title: "ui/AlertDialog",
    component: AlertDialog,
    tags: ["autodocs"],
    argTypes: {},
};

export default meta;

export const Base = {
    render: () => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Open</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ),
    args: {},
};
