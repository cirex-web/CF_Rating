import * as React from "react";
import css from "../styles/box.module.css";
interface IBoxProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  padding?: number;
}

const Box: React.FunctionComponent<IBoxProps> = ({ style, children ,...styles}) => {
  return (
    <div className={css.box} style={styles}>
      {children}
    </div>
  );
};

export default Box;
