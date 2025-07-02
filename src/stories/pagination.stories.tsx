import Pagination from "@/components/ui/pagination/Pagination";
import PaginationContent from "@/components/ui/pagination/PaginationContent";
import PaginationEllipsis from "@/components/ui/pagination/PaginationEllipsis";
import PaginationItem from "@/components/ui/pagination/PaginationItem";
import PaginationLink from "@/components/ui/pagination/PaginationLink";
import PaginationNext from "@/components/ui/pagination/PaginationNext";
import PaginationPrevious from "@/components/ui/pagination/PaginationPrevious";

const meta = {
    title: "ui/Pagination",
    component: Pagination,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => (
        <Pagination {...args}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
    args: {},
};
