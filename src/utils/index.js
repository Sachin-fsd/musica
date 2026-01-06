


export const leftIcons = [
    {
        image: <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            focusable="false"
            aria-hidden="true"
            style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}
        >
            <path d="m11.485 2.143-8 4.8-2 1.2a1 1 0 001.03 1.714L3 9.567V20a2 2 0 002 2h5v-8h4v8h5a2 2 0 002-2V9.567l.485.29a1 1 0 001.03-1.714l-2-1.2-8-4.8a1 1 0 00-1.03 0Z" />
        </svg>,
        label: "Home",
        link: "/browse",
        show: true
    },
    // {
    //     image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /><circle cx="12" cy="12" r="10" /></svg>,
    //     label: "Explore",
    //     link: "/browse",
    //     show: true
    // },
    // {
    //     image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
    //     label: "Search",
    //     link: "/search",
    //     show: true
    // },
    {
        image: <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 2.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13ZM12 7a5 5 0 110 10 5 5 0 010-10Zm3 5-5-3v6l5-3Z"></path></svg>,
        label: "Vibes",
        link: "/vibes",
        show: true
    },
]

const handleResize = (text) => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 640) {
        const maxLength = Math.floor(screenWidth / 20); // Adjust this factor as needed
        if (text.length > maxLength) {
            return `${text?.substring(0, maxLength)}...`;
        } else {
            return (text);
        }
    }
    else if (screenWidth <= 340) {
        const maxLength = Math.floor(screenWidth / 45); // Adjust this factor as needed
        if (text.length > maxLength) {
            return (`${text?.substring(0, maxLength)}...`);
        } else {
            return (text);
        }
    }
    else {
        return (text);
    }
};



export function decodeHtml(html) {
    if (!html) return;
    // Decode HTML entities
    let decodedString = html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ');

    // Check screen width and truncate for small screens
    if (typeof window !== "undefined") {
        return handleResize(decodedString)
    }

    return decodedString;
}
export function htmlParser(html) {
    if (!html) return;

    // Use DOMParser to decode HTML entities
    let decodedString = html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ');

    return decodedString;
}
