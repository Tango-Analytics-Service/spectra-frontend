// [build] library: 'shadcn'
import { BellIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/ui/components/button";
import Card from "@/ui/components/card/Card";
import CardContent from "@/ui/components/card/CardContent";
import CardHeader from "@/ui/components/card/CardHeader";
import CardFooter from "@/ui/components/card/CardFooter";
import CardTitle from "@/ui/components/card/CardTitle";
import CardDescription from "@/ui/components/card/CardDescription";
import { Switch } from "@/ui/components/switch";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Select, SelectValue } from "@/ui/components/select";
import SelectContent from "@/ui/components/select/SelectContent";
import SelectItem from "@/ui/components/select/SelectItem";
import SelectTrigger from "@/ui/components/select/SelectTrigger";

const meta = {
    title: "ui/Card",
    component: Card,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    render: () => {
        return (
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>
                        Deploy your new project in one-click.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name of your project" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="framework">Framework</Label>
                                <Select>
                                    <SelectTrigger id="framework">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="next">Next.js</SelectItem>
                                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                        <SelectItem value="astro">Astro</SelectItem>
                                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Deploy</Button>
                </CardFooter>
            </Card>
        );
    },
    args: {},
};

export const Notifications = {
    render: () => {
        return (
            <Card className={"w-[380px]"}>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>You have 3 unread messages.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <BellIcon />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Push Notifications
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Send notifications to device.
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <div
                        key={1}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                    >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Your call has been confirmed.
                            </p>
                            <p className="text-sm text-muted-foreground">1 hour ago</p>
                        </div>
                    </div>
                    <div
                        key={1}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                    >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                                You have a new message!
                            </p>
                            <p className="text-sm text-muted-foreground">1 hour ago</p>
                        </div>
                    </div>
                    <div
                        key={1}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                    >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Your subscription is expiring soon!
                            </p>
                            <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
                    </Button>
                </CardFooter>
            </Card>
        );
    },
    args: {
        mode: "single",
        className: "rounded-md border",
    },
};
