import React, { useEffect } from "react";
import classNames from "classnames";

type DefaultPillsProps = {
  label: string;
  classes: string;
  status: string; // 'success', 'warning', 'warning' 
  // successColor: string,
  // warningColor: string,
  // errorColor: string,
};

/*
 *
 *
 */ 
const DefaultPills = (props: DefaultPillsProps) => {

  const getStatusColor = () => {
    if (props.status === 'success') {
      return 'bg-mountainMeadowGreen';
    } else if (props.status === 'warning') {
      return 'bg-orangePantone';
    } else if (props.status === 'error') {
      return 'bg-red-400';
    } else {
      return null;
    }
  };

  useEffect(() => {
    console.log(props.status)
  });

  return (
    <div
      className={classNames([
        'rounded',
        props.padding ?? 'px-2 py-0.2', 
        getStatusColor(),
        'shadow', props.classes
      ])}
    >
      <span className="text-sm">{props.label}</span>
    </div>
  );
};

export default DefaultPills;