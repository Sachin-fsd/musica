import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { decodeHtml } from "@/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SuggestedSongsList = ({ autocompleteSongs, handleSuggestionClick }) => {
    return (
        <div>
            {autocompleteSongs && autocompleteSongs.length > 0 && autocompleteSongs.map((song, index) => (
                <Card key={index} className="my-2 p-0 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <Label className="text-lg cursor-pointer" onClick={() => handleSuggestionClick(song)}>
                            {decodeHtml(song.name, 14)}
                        </Label>
                    </CardHeader>
                    <CardFooter>
                        <Separator />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default SuggestedSongsList;


export const SuggestionCard = ({ song, onClick }) => {
    return (
        <Card className="my-2 p-2 cursor-pointer hover:bg-gray-100 transition-all duration-200" onClick={onClick}>
            <div className="text-sm font-medium truncate">{decodeHtml(song.name, 14)}</div>
            {/* <Separator /> */}
        </Card>
    );
};