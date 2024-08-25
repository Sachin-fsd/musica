import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { decodeHtml } from "@/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const SuggestionCard = ({ song, onClick }) => {
    return (
        <Card
            className="my-2 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            onClick={onClick}
        >
            <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                {decodeHtml(song.name, 14)}
            </div>
            {/* <Separator /> */}
        </Card>
    );
};
