


export const leftIcons = [
    // {
    //     image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>,
    //     label: "Home",
    //     link: "/browse",
    //     show: true
    // },
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
    // {
    //     image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-radar"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>,
    //     label: "Jam",
    //     link: "/browse",
    //     show: true
    // },
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



export function decodeHtml(html, size = 16) {
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
