"use client";

import { useMemo, useState } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const options = useMemo(() => countryList().getData(), []);
  const [selected, setSelected] = useState(
    options.find((c) => c.value === value) || null
  );

  const handleChange = (val: any) => {
    setSelected(val);
    onChange(val.value);
  };

  return (
    <Select
      options={options}
      value={selected}
      onChange={handleChange}
      placeholder="Select country"
      className="w-full"
      classNamePrefix="select"
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "transparent",
          borderRadius: "0.375rem",
          borderColor: state.isFocused ? "#6D28D9" : "#3f3f46",
          padding: "2px",
          boxShadow: state.isFocused ? "0 0 0 2px #6D28D9" : "none",
          "&:hover": {
            borderColor: "#6D28D9",
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#18181b",
          borderRadius: "0.375rem",
          zIndex: 1000,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "#6D28D9"
            : state.isFocused
            ? "#3f3f46"
            : "transparent",
          color: "white",
        }),
        singleValue: (base) => ({
          ...base,
          color: "white",
        }),
        input: (base) => ({
          ...base,
          color: "white",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9ca3af",
        }),
      }}
    />
  );
};

export default CountrySelect;
