import Card from "@/ui/components/card/Card";
import CardContent from "@/ui/components/card/CardContent";
import Carousel from "@/ui/components/carousel/Carousel";
import CarouselContent from "@/ui/components/carousel/CarouselContent";
import CarouselItem from "@/ui/components/carousel/CarouselItem";
import CarouselNext from "@/ui/components/carousel/CarouselNext";
import CarouselPrevious from "@/ui/components/carousel/CarouselPrevious";

const meta = {
    title: "ui/Carousel",
    component: Carousel,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => (
        <Carousel {...args} className="mx-12 w-full max-w-xs">
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    ),
    args: {},
};

export const Size = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => (
        <Carousel {...args} className="mx-12 w-full max-w-xs">
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    ),
    args: {},
};
