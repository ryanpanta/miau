import React from "react";
import styles from "./FeedModal.module.css";
import useFetch from "./../../Hooks/useFetch";
import { photoGet } from "../../api";
import Error from "../Helper/Error";
import Loading from "../Helper/Loading";
import PhotoContent from "../Photo/PhotoContent";
function FeedModal({ photo, setModalPhoto }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        async function fetchPhotos() {
            try {
                setLoading(true);
                setError(null);
                const response = await photoGet(photo.id);
                setData(response);
            } catch (err) {
                setError("Erro ao carregar foto.");
            } finally {
                setLoading(false);
            }
        }
        fetchPhotos();
    }, [photo]);

    function handleOutsideClick(event) {
        if (event.target === event.currentTarget) {
            setModalPhoto(null);
        }
    }
    return (
        <div className={styles.modal} onClick={handleOutsideClick}>
            {error && <Error error={error} />}
            {loading && <Loading />}
            {data && <PhotoContent data={data} />}
        </div>
    );
}

export default FeedModal;
