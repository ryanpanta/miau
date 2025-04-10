import React from "react";
import FeedPhotosItem from "./FeedPhotosItem";
import useFetch from "../../Hooks/useFetch";
import { photosGet } from "../../api";
import Error from "../Helper/Error";
import Loading from "../Helper/Loading";
import styles from "./FeedPhotos.module.css";
import Sadness from "../../Assets/sadness-cat.png";

function FeedPhotos({ page, user, setModalPhoto, setInfinite }) {
    const [photos, setPhotos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchPhotos() {
            try {
                setLoading(true);
                setError(null);
                const total = 10;
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
    if (photos)
        return (
            <ul className={`${styles.feed} animeLeft`}>
                {photos.length > 0 ? (
                    photos.map((photo) => (
                        <FeedPhotosItem
                            key={photo.id}
                            photo={photo}
                            setModalPhoto={setModalPhoto}
                        />
                    ))
                ) : (
                    <div className={styles.noPhotos}>
                        <img src={Sadness} alt="Gatinho triste" />
                        <p>
                            Nenhuma foto no momento. Que tal começar postando
                            uma? :)
                            
                        </p>
                        <a href="/conta/postar">Postar foto</a>
                    </div>
                )}
            </ul>
        );
    else return null;
}

export default FeedPhotos;
