import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
    songId: { type: String, required: true, unique: true, index: true },
    name: String,
    image: String,
    primaryArtist: String,
    duration: Number,
    language: String,
    expireAt: { type: Date, index: { expires: 0 } },
});

const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);

export default Song;
