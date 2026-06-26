const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function selectBestLyricsMatch(currentSong, searchResults) {
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
        return null;
    }

    const resultsWithSynced = searchResults.filter(
        r => r.syncedLyrics && r.syncedLyrics.trim().length > 0
    );

    if (resultsWithSynced.length === 0) {
        return null;
    }

    if (resultsWithSynced.length === 1) {
        return resultsWithSynced[0];
    }
    // console.log({resultsWithSynced})
    const currentSongStr = JSON.stringify({
        name: currentSong.name,
        artists: currentSong.artists?.all?.map(a => a.name) || [],
        album: currentSong.album?.name || "",
        duration: currentSong.duration
    });

    const resultsStr = JSON.stringify(
        resultsWithSynced.map((r, idx) => ({
            index: idx,
            trackName: r.trackName,
            artistName: r.artistName,
            albumName: r.albumName,
            duration: r.duration,
        }))
    );

    const prompt = `You are a music matching expert. Given a song we're looking for and multiple search results, return the index of the best matching result which contains synced lyrics of given song.

CURRENT SONG:
${currentSongStr}

SEARCH RESULTS:
${resultsStr}

RULES:
- All results already contain synced lyrics.
- A match is one whose album name and trackName matches (slight variations in name is acceptable)
- Prefer track name match.
- Album match is important.
- Duration within ±15 seconds is a bonus.
- Artist name variations are acceptable.
- Slight variations in song name is acceptable
- Return ONLY the index number.
- if the best match index value album name do not match then return -1.
- Return -1 if no good match exists.`;

    try {
        const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "groq/compound-mini",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Return only a number. No explanation."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 20,
                    temperature: 0
                })
            }
        );

        if (!res.ok) {
            const err = await res.json();
            throw new Error(
                err?.error?.message || `API Error ${res.status}`
            );
        }

        const data = await res.json();

        const reply =
            data?.choices?.[0]?.message?.content?.trim() ?? "-1";

        // console.log({ reply });

        const index = Number(reply);

        if (
            Number.isNaN(index) ||
            index < 0 ||
            index >= resultsWithSynced.length
        ) {
            return null;
        }

        return resultsWithSynced[index];
    } catch (error) {
        console.error("Error in AI agent:", error.message);

        // fallback
        return resultsWithSynced[0];
    }
}