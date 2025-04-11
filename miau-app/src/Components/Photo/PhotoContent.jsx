import React from "react";
import styles from "./PhotoContent.module.css";
import { Link } from "react-router-dom";
import PhotoComments from "./PhotoComments";
import { UserContext } from "../../UserContext";
import PhotoDelete from "./PhotoDelete";
import Image from "../Helper/Image";
import { Heart } from "lucide-react";
import { addLike } from "../../api";
import { useNavigate } from "react-router-dom";
function PhotoContent({ data, single }) {
    const user = React.useContext(UserContext);
    const { comments } = data;
    const [isLiked, setIsLiked] = React.useState(data?.hasLiked);
    const [likes, setLikes] = React.useState(data?.likes);

    const navigate = useNavigate();
    
    async function handleLike(event) {
        if (!user.login) {
            navigate("/login");
            return;
        }
        event.stopPropagation();
        try {
            setIsLiked(!isLiked);
            setLikes(isLiked ? likes - 1 : likes + 1);
            await addLike(data.id);
        } catch (error) {
            setIsLiked(!isLiked);
            setLikes(isLiked ? likes + 1 : likes - 1);
            console.error("Erro ao dar like:", error);
            alert("Erro ao dar like na foto. Tente novamente mais tarde");
        }
    }

    return (
        <div className={`${styles.photo} ${single && styles.single}`}>
            <div className={styles.img}>
                <Image src={data.imageUrl} alt={data.catName} />
            </div>
            <div className={styles.details}>
                <div>
                    <p className={styles.author}>
                        {user.data && user.data.username === data?.userName ? (
                            <PhotoDelete id={data.id} />
                        ) : (
                            <Link to={`/perfil/${data?.userName}`}>
                                @{data?.userName}
                            </Link>
                        )}
                        <div className={styles.buttonActions}>
                            <button onClick={handleLike}>
                                <Heart
                                    size={20}
                                    color={isLiked ? "red" : "#969696"}
                                    fill={isLiked ? "red" : "none"}
                                />
                                <span>{likes}</span>
                            </button>
                            <span className={styles.visualizacoes}>
                                {data.views}
                            </span>
                        </div>
                    </p>
                    <h1 className="title">
                        <Link to={`/foto/${data.id}`}>{data.catName}</Link>
                    </h1>
                    <ul className={styles.attributes}>
                        <li>{data.weight} kg</li>
                        <li>
                            {data.age} {data.age > 1 ? "anos" : "ano"}
                        </li>
                    </ul>
                    <div className={styles.description}>
                        <p>{data?.description}</p>
                    </div>
                </div>
            </div>
            <PhotoComments id={data.id} comments={comments} single={single} />
        </div>
    );
}

export default PhotoContent;
