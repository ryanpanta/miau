import React from "react";
import Enviar from "../../Assets/enviar.svg?react";
import useFetch from "../../Hooks/useFetch";
import { commentPost, getSuggestionComment } from "../../api";
import Error from "../Helper/Error";
import styles from "./PhotoCommentsForm.module.css";
function PhotoCommentsForm({ id, setComments, single }) {
    const [error, setError] = React.useState(null);
    const [comment, setComment] = React.useState("");
    const [loading, setLoading] = React.useState(false);
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

    async function handleSuggestionComment(event) {
        try {
            setLoading(true);
            setError(null);
            event.preventDefault();
            const response = await getSuggestionComment(id);
          
            const regex = /(^")|("$)/g;
            response.suggestion = response.suggestion.replace(regex, "");
            setComment(response.suggestion);
        } catch (error) {
            setComment("");
            console.error("Erro ao buscar uma sugestão de comentário:", error);
            setError("Erro ao buscar uma sugestão de comentário. Tente novamente mais tarde");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className={styles.container}>
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
            <div>
                <button className={styles.buttonIA} onClick={handleSuggestionComment}>
                    <span> {loading ? "Gerando..." : "Sem ideia? Gere um comentário por IA."}</span>
                </button>
            </div>
        </div>
    );
}

export default PhotoCommentsForm;
