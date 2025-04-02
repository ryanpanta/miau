import React from "react";
import Enviar from "../../Assets/enviar.svg?react";
import useFetch from "../../Hooks/useFetch";
import { commentPost } from "../../api";
import Error from "../Helper/Error";
import styles from "./PhotoCommentsForm.module.css";
function PhotoCommentsForm({ id, setComments, single }) {
    const [error, setError] = React.useState(null);
    const [comment, setComment] = React.useState("");

    async function handleSubmit(event) {
        try {
            setError(null);
            event.preventDefault();
            const response = await commentPost(id, { content: comment });
            setComment("");
            setComments((comments) => [...comments, response]);
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
            setError("Erro ao enviar comentário.");
        }
        
    }
    return (
        <form
            onSubmit={handleSubmit}
            className={`${styles.form} ${single ? styles.single : ""}`}
        >
            <textarea
                className={styles.textarea}
                id="comment"
                name="comment"
                placeholder="Comente..."
                value={comment}
                onChange={({ target }) => setComment(target.value)}
            />
            <button className={styles.button}>
                <Enviar />
            </button>
            <Error error={error} />
        </form>
    );
}

export default PhotoCommentsForm;
