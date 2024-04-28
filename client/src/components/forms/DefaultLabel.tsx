import React from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";

type DefaultLabelProps = {
  htmlFor: string,
  classes: string,
  text: string,
};

const DefaultLabel = (props: DefaultLabelProps) => {

  const preferedTheme = useSelector((state) => state.user.preferedTheme);

  return (
    <label
      htmlFor={props.htmlFor} 
      className={classNames(
        props.classes || "m-0 whitespace-nowrap",
        preferedTheme === "dark" ? "text-lightWhite" : "text-darkBlack"
      )}
    >
      {props.text}
    </label>
  );
}

export default DefaultLabel;