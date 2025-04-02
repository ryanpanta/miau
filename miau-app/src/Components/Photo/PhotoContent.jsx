import React from 'react'
import styles from './PhotoContent.module.css'
import { Link } from 'react-router-dom';
import PhotoComments from './PhotoComments';
import { UserContext } from '../../UserContext';
import PhotoDelete from './PhotoDelete';
import Image from '../Helper/Image';
function PhotoContent({data, single}) {
    const user = React.useContext(UserContext)
    const {comments} = data;
  return (
    <div className={`${styles.photo} ${single && styles.single}`}>
        <div className={styles.img}>
            <Image src={data.imageUrl} alt={data.description}/>
        </div>
        <div className={styles.details}>
            <div>
                <p className={styles.author}>
                    {user.data && user.data.username === data?.userName ? <PhotoDelete id={data.id} /> : <Link to={`/perfil/${data?.userName}`}>@{data?.userName}</Link>}
                    <span className={styles.visualizacoes}>{data.views}</span>
                </p>
                <h1 className='title'>
                    <Link to={`/foto/${data.id}`}>{data.description}</Link>
                </h1>
                <ul className={styles.attributes}>
                    <li>{data.weight} kg</li>
                    <li>{data.age} {data.idade > 1 ? "anos" : "ano"}</li>
                </ul>
            </div>
        </div>
        <PhotoComments id={data.id} comments={comments} single={single}/>
    </div>
  )
}

export default PhotoContent