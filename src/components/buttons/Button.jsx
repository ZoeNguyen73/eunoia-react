import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";

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
  } = props;

  return (
    <Button
      className={styles[`${category}`]}
      sx={{ fontWeight: 'bold', textTransform: 'none' }}
      variant={variant}
      component={upload ? 'label' : RouterLink}
      to={route}
      onClick={onClick}
      fullWidth={isFullWidth}
      disabled={disabled}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {title}
      {upload && (
        <input
          hidden
          accept=".png, .jpeg, .jpg*"
          type="file"
          onChange={onChange}
        />
      )}
    </Button>
  )
}
