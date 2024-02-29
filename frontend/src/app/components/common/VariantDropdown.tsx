import { FC } from 'react';

interface VariantDropdownProps {
  values: { [key: string]: string };
  selectedVariant: string;
  variantChangeHandler: (variant: string) => void;
}

const VariantDropdown: FC<VariantDropdownProps> = ({ values, selectedVariant, variantChangeHandler }) => {
  const options = Object.entries(values);

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    variantChangeHandler(newValue);
  };

  return (
    <div className="mb-3 mt-3">
      <div className="font-weight-bold inlineDiv mr-5" style={{ fontSize: '1.2rem' }}>
        Select an NFR Variant
      </div>
      <div className="inlineDiv">
        <select value={selectedVariant} onChange={changeHandler}>
          {options.map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VariantDropdown;
