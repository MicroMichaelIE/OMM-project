import { useState, useMemo } from "react";
import { FeedMeme } from "../../components/FeedMeme/FeedMeme";
import { Meme } from "../../types/types";

export const Feed = () => {
    const [memes, setMemes] = useState<Meme[]>([]);

    const getMemes = async () => {
        const response = await fetch("/api/memes");
        const data = await response.json();
        setMemes(data);
    };

    useMemo(() => {
        getMemes();
    }, []);

    /*
    const onLike = (meme: Meme) => {
        const newMemes = [...memes];
        const index = newMemes.findIndex((m) => m.id === meme.id);
        newMemes[index].likes++;
        setMemes(newMemes);
    };

    const onDislike = (meme: Meme) => {
        const newMemes = [...memes];
        const index = newMemes.findIndex((m) => m.id === meme.id);
        newMemes[index].dislikes++;
        setMemes(newMemes);
    };
    */


    return (
        <div className="Feed">
        <h1>Feed</h1>
        <div>
            {memes.map((meme) => (
                <FeedMeme key={meme.id}
                {...meme}
                />

        </div>
        </div>
    );
    };