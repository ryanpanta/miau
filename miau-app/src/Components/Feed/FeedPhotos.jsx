import React from "react";
import FeedPhotosItem from "./FeedPhotosItem";
import { photosGet } from "../../api";
import Error from "../Helper/Error";
import Loading from "../Helper/Loading";
import styles from "./FeedPhotos.module.css";
import Sadness from "../../Assets/sadness-cat.png";
import { Link } from "react-router-dom";

function FeedPhotos({ page, user, setModalPhoto, setInfinite }) {
    const [photos, setPhotos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchPhotos() {
            try {
                setLoading(true);
                setError(null);
                const total = 6;
                const response = await photosGet({ page, total, user });
                setPhotos(response.posts);
                if (response.posts.length < total) setInfinite(false);
            } catch (err) {
                setInfinite(false);
                console.error(err);
                setError("Erro ao carregar fotos.");
            } finally {
                setLoading(false);
            }
        }
        fetchPhotos();
    }, [user, page, setInfinite]);

    if (error) return <Error error={error} />;
    if (loading) return <Loading />;
    return (
        <ul className={`${styles.feed} animeLeft`}>
            {photos &&  photos.length > 0 ? (
                photos.map((photo) => (
                    <FeedPhotosItem
                        key={photo.id}
                        photo={photo}
                        setModalPhoto={setModalPhoto}
                    />
                ))
            ) : page < 2 ? (
                <div className={styles.noPhotos}>
                    <img src={Sadness} alt="Gatinho triste" />
                    <p>
                        Nenhuma foto no momento. Que tal começar postando uma?
                        :)
                    </p>
                    <Link to="/conta/postar">Postar foto</Link>
                </div>
            ) : null}
        </ul>
    );
}

export default FeedPhotos;
