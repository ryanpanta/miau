import React from "react";

function Head(props) {
    React.useEffect(() => {
        document.title = props.title + " | Miau";
        document
            .querySelector("meta[name='description']")
            .setAttribute("content", props.description || "");
    }, [props]);
    return <></>;
}

export default Head;
