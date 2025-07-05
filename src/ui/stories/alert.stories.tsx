// [build] library: 'shadcn'
import { RocketIcon } from "@radix-ui/react-icons";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Alert from "@/ui/components/alert/Alert";
import AlertDescription from "@/ui/components/alert/AlertDescription";
import AlertTitle from "@/ui/components/alert/AlertTitle";

const meta = {
    title: "ui/Alert",
    component: Alert,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Default = {
    render: () => {
        return (
            <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can add components to your app using the cli.
                </AlertDescription>
            </Alert>
        );
    },
    args: {},
};

export const Destructive = {
    render: () => {
        return (
            <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Your session has expired. Please log in again.
                </AlertDescription>
            </Alert>
        );
    },
    args: {},
};
