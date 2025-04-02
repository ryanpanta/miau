import React from "react";
import styles from "./FeedPhotosItem.module.css";
import Image from "../Helper/Image";
import { Heart } from "lucide-react";
import { addLike } from "../../api";

function FeedPhotosItem({ photo, setModalPhoto }) {
    const [isLiked, setIsLiked] = React.useState(photo.hasLiked);

    function handleClick() {
        setModalPhoto(photo);
    }

    async function handleLike(event) {
        event.stopPropagation();
        try {
            await addLike(photo.id);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Erro ao dar like:", error);
            alert("Erro ao dar like na foto.");
        }
    }

    return (
        <li className={styles.photo} onClick={handleClick}>
            <Image src={photo.imageUrl} alt={photo.description} />
            <span className={styles.visualizacao}>{photo.views}</span>
            <section className={styles.details}>
                <p>@{photo.username}</p>
                <button onClick={handleLike}>
                    <Heart
                        size={20}
                        color={isLiked ? "red" : "#969696"}
                        fill={isLiked ? "red" : "none"}
                    />
                </button>
            </section>
        </li>
    );
}

export default FeedPhotosItem;
