import React from "react";
import { UserContext } from "./../../UserContext";
import PhotoCommentsForm from "./PhotoCommentsForm";
import styles from "./PhotoComments.module.css";
function PhotoComments(props) {
    const [comments, setComments] = React.useState(() => props.comments);
    const commentsSection = React.useRef(null)
    const { login } = React.useContext(UserContext);

    React.useEffect(() => {
        commentsSection.current.scrollTop = commentsSection.current.scrollHeight;
    }, [comments])
    return (
        <>
            <ul ref={commentsSection} className={`${styles.comments} ${props.single ? styles.single : ''}`}>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <b>{comment.username}: </b>
                        <span>{comment.content}</span>
                    </li>
                ))}
            </ul>
            {login && <PhotoCommentsForm id={props.id} setComments={setComments} single={props.single}/>}
        </>
    );
}

export default PhotoComments;
