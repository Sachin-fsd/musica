import { Card, CardContent } from '@/components/ui/card';
import CustomCarousel from '@/components/ui/customCarousel';
import { Label } from '@/components/ui/label';

const TopArtists = () => {
  const artists = ["Arjit Singh", "Pritam", "Sachin Jigar", "Shreya Ghoshal", "Udit Narayan", "A.P. Dhillon"];

  const artistCards = artists.map((singer, index) => (
    <Card key={index} className="w-28 flex-shrink-0">
      <CardContent className="flex aspect-square items-center justify-center p-6">
        <span className="text-3xl font-semibold">{index + 1}</span>
      </CardContent>
    </Card>
  ));

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-4">
        <Label className="font-semibold text-lg text-gray-900">Top Artists</Label>
      </div>
      <CustomCarousel items={artistCards} />
    </div>
  );
};

export default TopArtists;
