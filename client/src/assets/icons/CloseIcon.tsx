import React from "react";
import classNames
 from "classnames";
type CloseIconProps = {
  classes?: string;
};

const CloseIcon = (props: CloseIconProps) => {
  return (
    <svg
      viewBox="-0.5 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6', 'h-6', props.classes)}
    >
    <path d="M3 21.32L21 3.32001" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 3.32001L21 21.32" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export default CloseIcon;