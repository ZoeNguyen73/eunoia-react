import React from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import styles from './Button.module.scss';

export default function CustomLoadingButton(props) {
  const {
    variant,
    title,
    category,
    route,
    onClick,
    isFullWidth,
    disabled = false,
    onMouseOver,
    onMouseLeave,
    upload = false,
    onChange,
    single = true,
    loading,
  } = props;

  return (
    <LoadingButton
      className={styles[`${category}`]}
      sx={{ fontWeight: 'bold', textTransform: 'none' }}
      variant={variant}
      to={route}
      onClick={onClick}
      fullWidth={isFullWidth}
      disabled={disabled}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      loading={loading}
    >
      {title}
    </LoadingButton>
  )
}
