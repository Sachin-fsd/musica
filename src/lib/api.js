// API client for saavn.dev
import axios from "axios";

const BASE_URL = 'https://saavn.dev/api';

// export interface ImageQuality {
//   quality: string;
//   url: string;
// }

// export interface ArtistInfo {
//   id: string;
//   name: string;
//   role: string;
//   type: string;
//   image: ImageQuality[];
//   url: string;
// }

// export interface AlbumInfo {
//   id: string | null;
//   name: string | null;
//   url: string | null;
// }

// export interface DownloadQuality {
//   quality: string;
//   url: string;
// }

// export interface Song {
//   id: string;
//   name: string;
//   type: string;
//   year: number | null;
//   releaseDate: string | null;
//   duration: number | null;
//   label: string | null;
//   explicitContent: boolean;
//   playCount: number | null;
//   language: string;
//   hasLyrics: boolean;
//   lyricsId: string | null;
//   url: string;
//   copyright: string | null;
//   album: AlbumInfo;
//   artists: {
//     primary: ArtistInfo[];
//     featured: ArtistInfo[];
//     all: ArtistInfo[];
//   };
//   image: ImageQuality[];
//   downloadUrl: DownloadQuality[];
// }

// export interface SearchResponse {
//   success: boolean;
//   data: {
//     total: number;
//     start: number;
//     results: Song[];
//   };
// }

const api = {
    // Search for music with any query
    search: async (query) => {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: { query }
        });
        return response.data;
    },

    // Search specifically for songs with pagination
    searchSongs: async (query, page = 0, limit = 10) => {
        const response = await axios.get(`${BASE_URL}/search/songs`, {
            params: { query, page, limit }
        });
        return response.data;
    },

    // Get song suggestions based on a song ID
    getSongSuggestions: async (songId, limit = 10) => {
        const response = await axios.get(`${BASE_URL}/songs/${songId}/suggestions`, {
            params: { limit }
        });
        return response.data;
    }
};

export default api;