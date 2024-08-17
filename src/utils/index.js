


export const leftIcons = [
    {
        image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>,
        label: "Home",
        link: "/browse",
        show: true
    },
    {
        image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /><circle cx="12" cy="12" r="10" /></svg>,
        label: "Explore",
        link: "/explore",
        show: true
    },
    {
        image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
        label: "Search",
        link: "/search",
        show: true
    },
    {
        image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-library"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7v10" /><path d="M11 7v10" /><path d="m15 7 2 10" /></svg>,
        label: "Saved",
        link: "/saved",
        show: true
    },
]


export function decodeHtml(html, size) {
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
        const screenWidth = window.innerWidth;

        if (screenWidth <= 640) { // Tailwind 'sm' breakpoint is 640px
            let maxLength =  Math.floor(screenWidth / 12); // Adjust this factor as needed
            if (size) {
                maxLength = Math.floor(screenWidth / size); 
            } 
            if (decodedString.length > maxLength) {
                decodedString = decodedString.substring(0, maxLength) + '...';
            }
        }
    }

    return decodedString;
}
