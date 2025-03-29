import React, { useEffect, useState } from "react";
import Select from "react-select";

const SearchableSelect = ({ options, placeholder, getOptionLabel, defaultValue, onChange }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (defaultValue && options.length > 0) {
            const defaultOpt = options.find(opt => String(opt.value) === String(defaultValue));
            setSelectedOption(defaultOpt || null);
        }
    }, [defaultValue, options]);
    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={(selected) => {
                setSelectedOption(selected);
                onChange?.(selected);
            }}
            isSearchable
            placeholder={placeholder}
            getOptionLabel={getOptionLabel}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
    );
};

export default SearchableSelect;
