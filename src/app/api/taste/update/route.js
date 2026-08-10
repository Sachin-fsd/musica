import { NextResponse } from 'next/server';
import { recomputeAllTasteProfiles } from '@/app/actions/tasteProfile';

// POST /api/taste/update  — hit by cron every 24 h to recompute all user taste profiles.
export async function POST() {
    try {
        const { updated } = await recomputeAllTasteProfiles();
        return NextResponse.json({ success: true, updated });
    } catch (err) {
        console.error('/api/taste/update error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// Also handle GET for flexibility with different cron providers.
export async function GET() {
    return POST();
}
