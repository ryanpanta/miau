import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import { photoGet } from "../../api";
import Error from "../Helper/Error";
import Loading from "../Helper/Loading";
import PhotoContent from "./PhotoContent";
import Head from "../Helper/Head";

function Photo() {
    const { id } = useParams();
    const { data, loading, error, request } = useFetch();

    React.useEffect(() => {
        const { url, options } = photoGet(id);
        request(url, options);
    }, [request, id]);

    if (error) return <Error erorr={error} />;
    if (loading) return <Loading />;
    if (data)
        return (
            <section className="container mainContainer">
                <Head title={data.photo.title} />
                <PhotoContent data={data} single />
            </section>
        );
    else return null;
}

export default Photo;
