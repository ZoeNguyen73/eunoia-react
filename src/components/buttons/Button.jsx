import Button from "@mui/material/Button";

import styles from './Button.module.scss';

export default function CustomButton(props) {
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
  } = props;

  return (
    <Button
      className={styles[`${category}`]}
      sx={{ fontWeight: 'bold', textTransform: 'none' }}
      variant={variant}
      to={route}
      onClick={onClick}
      fullWidth={isFullWidth}
      disabled={disabled}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {title}
    </Button>
  )
}
