import React, { useState } from "react";
import Select from "react-select";

const SearchableSelect = ({ options, placeholder = "Chọn một mục...", getOptionLabel }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            isSearchable={true}
            placeholder={placeholder}
            getOptionLabel={getOptionLabel}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
    );
};

export default SearchableSelect;
