// ─── All greeting templates ───────────────────────────────────────────────
// {name} is replaced with the user's first name (or "there" when logged out).
// The more templates, the fresher it feels — add freely.

const TEMPLATES = {
    // ── Time-of-day buckets ────────────────────────────────────────────────
    lateNight: [
        'Still up, {name}?',
        'Burning the midnight oil, {name}?',
        '3 AM energy, {name}',
        'Night owl mode: ON, {name}',
        'Just stay vibing, {name}',
        'Late night sounds just hit different, {name}',
        'Stars are out, {name}. So are the speakers.',
        'Midnight melodies for {name}',
        '{name}, Keep it playing.',
        'We\'ve got the beat {name}',
    ],
    morning: [
        'Good morning, {name}',
        'Rise and shine, {name} 🎶',
        'Morning beats for {name}',
        'Fresh start, fresh tunes, {name}',
        'Sun\'s up and so is the playlist, {name}',
        'Wake up the speakers, {name}. It\'s a new day.',
        'Good morning, {name}. Coffee and chords ready.',
        'Day one of the rest of your playlist, {name}',
        'Top of the morning, {name}',
        'Bright day ahead — let\'s soundtrack it, {name}',
    ],
    afternoon: [
        'Good afternoon, {name}',
        'Afternoon vibes, {name}',
        'Midday melodies for {name}',
        'Halfway through the day, {name}',
        'The playlist\'s warm and ready, {name}',
        'Good afternoon, {name}.',
        'Prime time for prime tunes, {name}',
        'Day\'s in full swing. So is the sound, {name}',
        'Afternoon reset for {name} 🎧',
        'Chill hours for {name}',
    ],
    evening: [
        'Good evening, {name}',
        'Evening wind-down, {name}',
        'Golden hour sounds for {name}',
        'The day\'s done, {name}. Time to unwind.',
        'Good evening! Let the music take over, {name}',
        'Sunset and songs for {name}',
        'Easy evening, {name}. Hit play and breathe.',
        'Evening glow, {name}. Even better with music.',
        'Winding down with {name}',
        'The night\'s young and the playlist\'s ready, {name}',
    ],
    night: [
        'Good night, {name}',
        'Night vibes loading for {name}',
        'Late night listening session, {name}',
        'Cozy sounds for a cozy {name}',
        'One last listen before bed, {name}?',
        'Moon\'s up. Music\'s up. {name} is set.',
        'Stars, {name}, and a good beat',
        'Ending the day right, {name}',
        'Nightcap for the ears, {name}',
        'The best part of {name}\'s day starts now',
    ],

    // ── Generic / welcome-back ─────────────────────────────────────────────
    generic: [
        'Back at it, {name}',
        'Welcome back, {name}',
        'Good to see you, {name}',
        'Let\'s find your sound, {name}',
        'Ready for some music, {name}?',
        'Your daily dose of music, {name}',
        'Hey {name}, what are we vibing today?',
        'Glad you\'re here, {name}',
        'The speakers missed you, {name}',
        'Turn it up, {name}',
        'What\'s playing today, {name}?',
        'Your ears deserve this, {name}',
        'Where to next, {name}?',
        'Settle in, {name}. Good things are playing.',
        'Another day, another vibe, {name}',
        'Hello hello, {name} 👋',
        'Making space for some magic, {name}',
        'You again? We love to see it, {name}',
        'Keep it playing, {name}',
        'The vibe is calling, {name}',
    ],

    // ── Day-of-week ────────────────────────────────────────────────────────
    monday: [
        'New week, new beats, {name}',
        'Monday mood: press play, {name}',
        'Start the week right, {name}',
        'Monday magic loading for {name}',
        'One play and Monday gets better, {name}',
        'The week\'s fresh and so is this playlist, {name}',
    ],
    tuesday: [
        'Tuesday groove, {name}',
        'Keep the momentum going, {name}',
        'Midweek is close, {name}. Keep vibing.',
        'Tuesday tunes with {name}',
        'Second day, full energy, {name}',
    ],
    wednesday: [
        'Hump day tunes for {name}',
        'Halfway there, {name} 🎉',
        'Wednesday wisdom: music fixes everything, {name}',
        'Over the hump, {name}. It\'s all downhill from here.',
        'Midweek melody for {name}',
    ],
    thursday: [
        'Almost Friday, {name}',
        'Thursday throws with {name}',
        'One more day, {name}. Let the music carry you.',
        'The weekend is in sight, {name}',
        'Thursday energy, {name}',
    ],
    friday: [
        'Friday feels, {name} 🥳',
        'It\'s finally Friday, {name}!',
        'Weekend is loading, {name}',
        'Friday night playlist for {name}',
        'TGIF, {name}',
        'Unlock the weekend with a beat, {name}',
    ],
    saturday: [
        'Saturday vibes, {name}',
        'Weekend mode: ON for {name}',
        'Let\'s make today loud, {name}',
        'Saturday sounds for {name}',
        'No alarms, just vibes, {name}',
    ],
    sunday: [
        'Sunday chill, {name}',
        'Easy Sunday beats for {name}',
        'Rest, recharge, replay, {name}',
        'Sunday reset with {name}',
        'Slow morning sounds for {name}',
    ],
};

// ─── Subtitle lines that rotate under the greeting ─────────────────────────
const SUBTITLES = [
    'Here\'s what\'s moving today',
    'Your daily soundtrack is ready',
    'Press play and let it take you away',
    'Fresh picks, just for you',
    'Something good is about to play',
    'Sounds curated for the moment',
    'Tune in. Turn up. Zone out.',
    'The vibe is always right here',
    'Handpicked for your ears today',
    'Every beat leads somewhere new',
    'Your speakers are warmed up',
    'Let\'s make some noise',
    'Good songs. Good mood. Good you.',
    'Today\'s playlist has no bad track',
    'Floating on frequencies',
    'Music that matches the moment',
];

// ─── Small accents that decorate the greeting ──────────────────────────────
const ACCENTS = ['🎵', '🎶', '🎧', '✨', '✳️', '🔊', '🎸', '🎹', '🥁', '🎼'];

const DAY_KEYS = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

export { TEMPLATES, SUBTITLES, ACCENTS, DAY_KEYS };
