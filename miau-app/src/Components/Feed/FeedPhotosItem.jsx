import React from 'react'
import styles from './FeedPhotosItem.module.css';
import Image from '../Helper/Image';

function FeedPhotosItem({photo, setModalPhoto}) {

  function handleClick(){
    setModalPhoto(photo)
  }
  return (
    <li className={styles.photo} onClick={handleClick}>
      
        <Image src={photo.imageUrl} alt={photo.description}/>
        <span className={styles.visualizacao}>{photo.views}</span>
    </li>
  )
}

export default FeedPhotosItem