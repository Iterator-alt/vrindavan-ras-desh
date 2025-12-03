export function extractYouTubeId(url: string): string | null {
    if (!url) return null;

    // Handle already embedded URLs
    if (url.includes('youtube.com/embed/')) {
        return url;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
        ? `https://www.youtube.com/embed/${match[2]}`
        : null;
}
