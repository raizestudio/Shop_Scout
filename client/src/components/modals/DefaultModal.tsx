import React, { useState } from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";

// Components
import CloseIcon from "../../assets/icons/CloseIcon";
import DefaultButton from "../buttons/DefaultButton";
import DefaultInput from "../forms/DefaultInput";
import DefaultLabel from "../forms/DefaultLabel";
import DefaultSelect from "../forms/DefaultSelect";

type DefaultModalProps = {
  onClose: () => void;
  onAction: () => void;
};

const DefaultModal = (props: DefaultModalProps) => {

  const preferedTheme = useSelector((state) => state.user.preferedTheme);

  const [search, setSearch] = useState({
    searchTerm: "",
    topN: "",
    country: "",
    filter: "",
    websites: [String],
  });

  const updateSearch = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

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
            <DefaultInput placeholder="Search Term" value={search.searchTerm} onChange={(e) => updateSearch(e)} name="searchTerm" />
            <DefaultLabel text="TopN" />
            <DefaultInput placeholder="Top N" value={search.topN} onChange={(e) => updateSearch(e)} name="topN" />
            <DefaultLabel text="Country" />
            <DefaultSelect onChange={(e) => updateSearch(e)} name="country" options={["France", "India", "United States"]} />
            <DefaultLabel text="Filter" />
            <DefaultSelect onChange={(e) => updateSearch(e)} name="filter" options={["Price", "Category"]} />
            <DefaultLabel text="Websites" />
            <DefaultSelect onChange={(e) => updateSearch(e)} name="websites" options={["Amazon", "Snapdeal"]} />
          </div>
        </div>
        <div className={classNames('flex justify-end gap-2')}>
          <DefaultButton text="Close" onClick={props.onClose} />
          <DefaultButton text="Search" onClick={() => props.onAction(search)} />
        </div>
      </div>
    </div>
  );
};

export default DefaultModal;