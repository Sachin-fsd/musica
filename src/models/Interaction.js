import mongoose from 'mongoose';

/**
 * Interaction model — stores every tracked user ↔ song event.
 *
 * Current interaction types:
 *  - "liked"      → user tapped the like/heart button
 *  - "skipped"    → user changed song within 10 s of playback (doesn't want to hear it)
 *  - "completed"  → user listened to ≥90 % of the song duration
 *  - "replayed"   → user looped / replayed the song
 *  - "searched"   → user played a song directly from search results
 *  - "downloaded" → user tapped the download button
 *
 */

const InteractionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        songId: {
            type: String,   // JioSaavn song ID (string like "1234567")
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['liked', 'skipped', 'completed', 'replayed', 'searched', 'downloaded'],
            required: true,
        },
        count: {
            type: Number,
            default: 1,
            min: 1,
        },
    },
    { timestamps: true }
);

InteractionSchema.index({ userId: 1, songId: 1, type: 1 }, { unique: true });

const Interaction =
    mongoose.models.Interaction || mongoose.model('Interaction', InteractionSchema);

export default Interaction;