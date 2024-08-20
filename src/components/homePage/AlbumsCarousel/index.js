import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";

const AlbumCarousel = () => {
    return (
        <div className="w-full max-w-full">
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <div className="flex justify-between mb-2">
                    <Label>Moody Albums</Label>
                    <div className="flex space-x-2">
                        <CarouselPrevious className="right-auto" />
                        <CarouselNext className="right-0" />
                    </div>
                </div>
                <CarouselContent className="flex space-x-2">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem key={index} className="flex-shrink-0 w-[calc(100%/3)] md:w-[calc(100%/4)] lg:w-[calc(100%/6)]">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-3xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default AlbumCarousel;
