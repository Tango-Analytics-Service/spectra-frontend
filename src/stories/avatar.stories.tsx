// [build] library: 'shadcn'
import Avatar from "@/components/ui/avatar/Avatar";
import AvatarFallback from "@/components/ui/avatar/AvatarFallback";
import AvatarImage from "@/components/ui/avatar/AvatarImage";

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
