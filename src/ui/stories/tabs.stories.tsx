// [build] library: 'shadcn'
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Tabs } from "@/ui/components/tabs";
import TabsContent from "@/ui/components/tabs/TabsContent";
import TabsList from "@/ui/components/tabs/TabsList";
import TabsTrigger from "@/ui/components/tabs/TabsTrigger";

const meta = {
    title: "ui/Tabs",
    component: Tabs,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => (
        <Tabs {...args} className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Make changes to your account here. Click save when you&apos;re done.
                </p>
                <div className="grid gap-2 py-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Pedro Duarte" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="@peduarte" />
                    </div>
                </div>
                <div className="flex">
                    <Button>Save changes</Button>
                </div>
            </TabsContent>
            <TabsContent value="password">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Change your password here. After saving, you&apos;ll be logged out.
                </p>
                <div className="grid gap-2 py-4">
                    <div className="space-y-1">
                        <Label htmlFor="current">Current password</Label>
                        <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="new">New password</Label>
                        <Input id="new" type="password" />
                    </div>
                </div>
                <div className="flex">
                    <Button>Save password</Button>
                </div>
            </TabsContent>
        </Tabs>
    ),
    args: {
        defaultValue: "account",
    },
};
