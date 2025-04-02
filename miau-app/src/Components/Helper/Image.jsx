import React from 'react'
import styles from './Image.module.css'
function Image({alt, ...props}) {
    const [loading, setLoading] = React.useState(true)

    function handleLoad({target}){
        target.style.opacity = 1;
        setLoading(false)
    }
  return (
    <div className={styles.wrapper}>
        {loading && <div className={styles.skeleton}></div>}
        <img onLoad={handleLoad} className={styles.img} alt={alt} {...props} />
    </div>
  )
}

export default Image