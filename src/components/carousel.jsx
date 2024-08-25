import { songs } from "@/utils/cachedSongs";
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css";
import AlbumBar from "./homePage/TopAlbums/AlbumBar";
const AlbumMulticarousel = () => {
    return (
        <Carousel
            additionalTransfrom={0}
            arrows
            autoPlaySpeed={3000}
            centerMode={false}
            className="overflow-hidden max-w-[95%] mx-auto"
            containerClass="container-with-dots"
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
                desktop: {
                    breakpoint: {
                        max: 3000,
                        min: 1024
                    },
                    items: 3,
                    partialVisibilityGutter: 40
                },
                mobile: {
                    breakpoint: {
                        max: 464,
                        min: 0
                    },
                    items: 1,
                    partialVisibilityGutter: 30
                },
                tablet: {
                    breakpoint: {
                        max: 1024,
                        min: 464
                    },
                    items: 2,
                    partialVisibilityGutter: 30
                }
            }}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
        >
            {songs.map((song, index) => (
                <div
                    key={index}
                    className={`p-2 border bg-gray-300 rounded flex-shrink-0`}
                >
                    <AlbumBar song={song} index={index} />
                </div>
            ))}
        </Carousel >
    )
}

export default AlbumMulticarousel