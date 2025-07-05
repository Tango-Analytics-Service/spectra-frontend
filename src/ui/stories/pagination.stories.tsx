import Pagination from "@/ui/components/pagination/Pagination";
import PaginationContent from "@/ui/components/pagination/PaginationContent";
import PaginationEllipsis from "@/ui/components/pagination/PaginationEllipsis";
import PaginationItem from "@/ui/components/pagination/PaginationItem";
import PaginationLink from "@/ui/components/pagination/PaginationLink";
import PaginationNext from "@/ui/components/pagination/PaginationNext";
import PaginationPrevious from "@/ui/components/pagination/PaginationPrevious";

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
