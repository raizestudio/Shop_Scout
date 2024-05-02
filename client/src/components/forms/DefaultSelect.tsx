import React from "react";

type DefaultSelectProps = {
  id: string;
  name: string;
  value: string;
  classes: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<string>;
};

const DefaultSelect = (props: DefaultSelectProps) => {
  return (
    <select
      id={props.id}
      name={props.name}
      className={props.classes || "text-white m-0 bg-transparent border border-white rounded-full focus:border-teleMagenta focus:ring-0 py-3 px-6"}
      value={props.value}
      onChange={props.onChange}
    >
      {props.options.map((option, index) => (
        <option key={index} value={option} className="text-gray-800">
          {option}
        </option>
      ))}
    </select>
  );
}

export default DefaultSelect;