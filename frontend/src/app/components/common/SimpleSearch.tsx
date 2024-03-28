import React, { useState } from 'react';

interface SimpleSearchProps<T extends Record<string, any>> {
  searchKeys: string[];
  data: T[];
  onSearch: (filteredData: T[]) => void;
}

const SimpleSearch = <T extends Record<string, any>>({ searchKeys, data, onSearch }: SimpleSearchProps<T>) => {
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setFilterText(text);

    const filteredData = data.filter((item) =>
      searchKeys.some((key) => item[key]?.toString().toLowerCase().includes(text.toLowerCase()))
    );

    onSearch(filteredData);
  };

  return (
    <div>
      <input type="text" placeholder="Search..." value={filterText} onChange={handleFilterChange} />
    </div>
  );
};

export default SimpleSearch;
