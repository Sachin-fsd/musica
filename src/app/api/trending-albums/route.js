// import { all_top_playlists } from '@/utils/cachedSongs';
// import { NextResponse } from 'next/server';

// export async function GET() {
//     try {
//         const response = await fetch(all_top_playlists.trending_Albums, {
//             headers: {
//                 "Content-Type": "text/html; charset=UTF-8",
//                 "Connection": "keep-alive",
//             },
//         });


//         if (!response.ok) {
//             return NextResponse.json({ ok: false, msg: "not found" }, { status: response.status });
//         }

//         const data = await response.json();
//         return NextResponse.json({ ok: true, data });
//     } catch (error) {
//         console.error('Error fetching trending albums:', error);
//         return NextResponse.json({ ok: false, msg: "error occurred" }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const link = searchParams.get('link');

        if (!link) {
            return NextResponse.json({ ok: false, msg: "Link parameter is missing" }, { status: 400 });
        }

        const response = await fetch(link, {
            headers: {
                "Content-Type": "text/html; charset=UTF-8",
                "Connection": "keep-alive",
            },
        });

        // console.log("response",response);
        let d = await response.text();
        // console.log("d=>>",d)

        // const contentType = response.headers.get("content-type");

        // if (!response.ok || !contentType || !contentType.includes("application/json")) {
        //     console.error('Unexpected response format:', await response.text());
        //     return NextResponse.json({ ok: false, msg: "Unexpected response format" }, { status: 500 });
        // }

        if (!response.ok) {
            return NextResponse.json({ ok: false, msg: "not found" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ ok: true, data });
    } catch (error) {
        console.error('Error fetching trending albums:', error);
        return NextResponse.json({ ok: false, msg: "Error occurred" }, { status: 500 });
    }
}

