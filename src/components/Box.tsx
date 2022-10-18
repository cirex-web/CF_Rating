import * as React from "react";
import css from "../styles/box.module.css";
interface IBoxProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Box: React.FunctionComponent<IBoxProps> = ({ style, children }) => {
  return (
    <div className={css.box} style={style}>
      {children}
    </div>
  );
};

export default Box;
