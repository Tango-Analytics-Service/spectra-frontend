// [build] library: 'shadcn'
import Avatar from "@/ui/components/avatar/Avatar";
import AvatarFallback from "@/ui/components/avatar/AvatarFallback";
import AvatarImage from "@/ui/components/avatar/AvatarImage";

const meta = {
    title: "ui/Avatar",
    component: Avatar,
    tags: ["autodocs"],
    argTypes: {},
};

export default meta;

export const Base = {
    render: () => (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
    args: {},
};
