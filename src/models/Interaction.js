import mongoose from 'mongoose';

/**
 * Interaction model — stores every tracked user ↔ song event.
 *
 * Current interaction types:
 *  - "liked"      → user tapped the like/heart button
 *  - "skipped"    → user changed song within 10 s of playback (doesn't want to hear it)
 *  - "completed"  → user listened to ≥90 % of the song duration
 *  - "replayed"   → user looped / replayed the song
 *  - "downloaded" → user tapped the download button
 *
 * Only "liked" is implemented in the UI right now; the schema is ready for the rest.
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
            enum: ['liked', 'skipped', 'completed', 'replayed', 'downloaded'],
            required: true,
        },
        // Optional: snapshot of song metadata at interaction time so we can
        // display liked songs even if the upstream API later changes.
        songMeta: {
            name: String,
            image: String,      // smallest thumbnail URL
            primaryArtist: String,
            duration: Number,
        },
    },
    { timestamps: true }
);

// Compound index: one "liked" record per user+song (upsert pattern).
// Other types (skipped, completed) are NOT unique — a user can skip many times.
InteractionSchema.index(
    { userId: 1, songId: 1, type: 1 },
    { unique: false }   // We handle uniqueness in the action with findOneAndUpdate
);

const Interaction =
    mongoose.models.Interaction || mongoose.model('Interaction', InteractionSchema);

export default Interaction;