// [build] library: 'shadcn'
import { AlertDialog, AlertDialogTrigger } from "@/ui/components/alert-dialog";
import AlertDialogAction from "@/ui/components/alert-dialog/AlertDialogAction";
import AlertDialogCancel from "@/ui/components/alert-dialog/AlertDialogCancel";
import AlertDialogContent from "@/ui/components/alert-dialog/AlertDialogContent";
import AlertDialogDescription from "@/ui/components/alert-dialog/AlertDialogDescription";
import AlertDialogFooter from "@/ui/components/alert-dialog/AlertDialogFooter";
import AlertDialogHeader from "@/ui/components/alert-dialog/AlertDialogHeader";
import AlertDialogTitle from "@/ui/components/alert-dialog/AlertDialogTitle";
import { Button } from "@/ui/components/button";

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
