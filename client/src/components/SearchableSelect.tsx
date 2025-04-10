import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";

interface SearchableSelectProps<T> {
    options: T[];
    placeholder?: string;
    defaultValue?: string | number;
    getOptionLabel?: (option: T) => string;
    onChange?: (option: SingleValue<T>) => void;
}

function SearchableSelect<T extends { value: string | number }>({
    options,
    placeholder,
    getOptionLabel,
    defaultValue,
    onChange,
}: SearchableSelectProps<T>) {
    const [selectedOption, setSelectedOption] = useState<T | null>(null);

    useEffect(() => {
        if (defaultValue && options.length > 0) {
            const defaultOpt = options.find(
                (opt) => String(opt.value) === String(defaultValue)
            );
            setSelectedOption(defaultOpt || null);
        }
    }, [defaultValue, options]);

    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={(selected) => {
                setSelectedOption(selected as T);
                onChange?.(selected as SingleValue<T>);
            }}
            isSearchable
            placeholder={placeholder}
            getOptionLabel={getOptionLabel}
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
    );
}

export default SearchableSelect;
