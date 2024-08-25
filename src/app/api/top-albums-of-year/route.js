import { all_top_playlists } from '@/utils/cachedSongs';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(all_top_playlists.top_albums_of_year, {
            headers: {
                "Content-Type": "text/html; charset=UTF-8",
                "Connection": "keep-alive",
            },
        });


        if (!response.ok) {
            return NextResponse.json({ ok: false, msg: "not found" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ ok: true, data });
    } catch (error) {
        console.error('Error fetching trending albums:', error);
        return NextResponse.json({ ok: false, msg: "error occurred" }, { status: 500 });
    }
}
