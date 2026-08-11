import mongoose from 'mongoose';

/**
 * TasteProfile model — caches a user's computed music taste so it can be shown
 * instantly on login without recomputing from interactions every time.
 *
 * Sub-documents:
 *  - topArtists   → ranked favourite artists (name + image + score)
 *  - topSongs     → ranked favourite songs (unused for now, kept for later)
 *  - topLanguages → ranked favourite languages
 */

const TopArtistSchema = new mongoose.Schema(
    {
        artistId: String,
        artist: String,
        image: String,
        score: Number,
    },
    { _id: false }
);

const TopSongSchema = new mongoose.Schema(
    {
        songId: String,
        name: String,
        image: String,
        artist: String,
        duration: Number,
        score: Number,
    },
    { _id: false }
);

const TopLanguageSchema = new mongoose.Schema(
    {
        language: String,
        score: Number,
    },
    { _id: false }
);

const TasteProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        topArtists: [TopArtistSchema],
        topSongs: [TopSongSchema],
        topLanguages: [TopLanguageSchema],
        computedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const TasteProfile =
    mongoose.models.TasteProfile || mongoose.model('TasteProfile', TasteProfileSchema);

export default TasteProfile;
