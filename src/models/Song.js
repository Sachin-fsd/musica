import mongoose from 'mongoose';

const PrimaryArtistSchema = new mongoose.Schema(
    {
        name: String,
        thumbnailUrl: String,
    },
    { _id: false }
);

const SongSchema = new mongoose.Schema({
    songId: { type: String, required: true, unique: true, index: true },
    name: String,
    image: String,
    primaryArtists: [PrimaryArtistSchema],
    duration: Number,
    language: String,
    expireAt: { type: Date, index: { expires: 0 } },
});

const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);

export default Song;
