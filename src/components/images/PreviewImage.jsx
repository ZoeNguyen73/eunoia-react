import React from 'react';
import styles from './Images.module.scss';

export default function PreviewImage(props) {
  return (
    <img className={styles['preview-image']}
      src={`${props.imgUrl}`}
      alt={`${props.imgUrl}`}
      width={props.sx.width || 128}
      height={props.sx.height || 128}
      marginBottom={props.sx.height || '2em'}
    />
  )
}
