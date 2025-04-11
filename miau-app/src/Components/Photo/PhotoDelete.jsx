import React from "react";
import styles from "./PhotoDelete.module.css";
import { photoDelete } from "../../api";
import useFetch from "../../Hooks/useFetch";
function PhotoDelete({ id }) {
    const [loading, setLoading] = React.useState(false);
    async function handleClick() {
        const confirm = window.confirm("Tem certeza que deseja excluir?");
        if (confirm) {
            try {
                setLoading(true);
                await photoDelete(id);
                window.location.reload();
            } catch (error) {
                console.error("Error ao deletar a foto:", error);
            } finally {
                setLoading(false);
            }
        }
    }
    return (
        <>
            {loading ? (
                <button disabled className={styles.delete}>
                    Deletando...
                </button>
            ) : (
                <button onClick={handleClick} className={styles.delete}>
                    Deletar
                </button>
            )}
        </>
    );
}

export default PhotoDelete;
