import React, { useState } from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";

// Components
import CloseIcon from "../../assets/icons/CloseIcon";
import DefaultButton from "../buttons/DefaultButton";
import DefaultInput from "../forms/DefaultInput";
import DefaultLabel from "../forms/DefaultLabel";

type DefaultModalProps = {
  onClose: () => void;
};

const DefaultModal = (props: DefaultModalProps) => {

  const preferedTheme = useSelector((state) => state.user.preferedTheme);

  const [search, setSearch] = useState({
    
  });

  return (
    <div className={classNames([
      'absolute',
      'flex',
      'justify-center',
      'items-center',
      'top-0',
      'py-2',
      'px-2',
      'h-full',
      'w-full',
      'bg-darkerBlack',
      'z-10',
      'rounded',
    ])}>
      <div className={classNames('flex flex-col w-full h-full rounded p-2',
        preferedTheme === "dark" ? "bg-darkBlack" : "bg-lightWhite"
      )}>
        <div className={classNames(
          'flex justify-between items-center'
        )}>
          <span
            className={classNames('font-bold text-lg',
              preferedTheme === "dark" ? "text-lightWhite" : "text-darkBlack"
            )}
          >DefaultModal</span>
          <div className={classNames('bg-lighterDark rounded p-2 cursor-pointer')} onClick={props.onClose}>
            <CloseIcon />
          </div>
        </div>
        <div className={classNames('flex flex-col flex-grow')}>
          <div className={classNames('flex flex-col w-1/4')}>
            <DefaultLabel text="Search Term" />
            <DefaultInput placeholder="Search Term"/>
          </div>
        </div>
        <div className={classNames('flex justify-end gap-2')}>
          <DefaultButton text="Close" onClick={props.onClose} />
          <DefaultButton text="Search" onClick={props.onClose} />
        </div>
      </div>
    </div>
  );
};

export default DefaultModal;