import Image from "next/image";

// export interface SongCardProps {
//     id: string;
//     title: string;
//     image: { quality: string; url: string }[];
//     album: string;
//     url: string;
//     type: string;
//     description: string;
//     primaryArtists: string;
//     singers: string;
//     language: string;
// }

const TopQueryCard = ({ data }) => {
    return (
        <div style={styles.container}>
            <div className="justify-items-center">
                <Image
                    src={data.image?.[2]?.url || data.image?.[0]?.url}
                    width={200}
                    height={200}
                    style={styles.cover}
                />
            </div>
            <p style={styles.title}>{data.title}</p>
            <p style={styles.subtitle}>{data.primaryArtists}</p>
            <p style={styles.subtitle}>{data.album || data.description}</p>
            <p style={styles.subtitle}>{data.type}</p>
        </div>
    );
};

const styles = {
    container: {
        padding: 10,
        margin: 10,
        alignItems: "center",
        textAlign: "center"
    },
    cover: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center"
    },
    subtitle: {
        color: "grey",
        fontSize: 14,
        width: "auto",
        textAlign: "center",
    },
};

export default TopQueryCard;
