import React from "react";
import styles from "./FeedPhotosItem.module.css";
import Image from "../Helper/Image";
import { Heart } from "lucide-react";
import { addLike } from "../../api";
import {UserContext} from "../../UserContext";
import { Link, useNavigate } from "react-router-dom";
function FeedPhotosItem({ photo, setModalPhoto }) {
    const { login, data } = React.useContext(UserContext);
    const [isLiked, setIsLiked] = React.useState(photo.hasLiked);

    const navigate = useNavigate();

    function handleClick() {
        setModalPhoto(photo);
    }

    async function handleLike(event) {
        if (!login) {
            navigate("/login");
            return;
        }
        event.stopPropagation();
        try {
            setIsLiked(!isLiked);
            await addLike(photo.id);
        } catch (error) {
            setIsLiked(!isLiked);
            console.error("Erro ao dar like:", error);
            alert("Erro ao dar like na foto. Tente novamente mais tarde");
        }
    }

    return (
        <li className={styles.photo} onClick={handleClick}>
            <Image src={photo.imageUrl} alt={photo.description} />
            <span className={styles.visualizacao}>{photo.views}</span>
            <section className={styles.details}>
                <Link to={`/perfil/${photo.username}`}>{photo.username === data?.username ? 'eu' : '@' + photo.username}</Link>
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
