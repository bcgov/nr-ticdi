import { FC } from "react";

interface VariantDropdownProps {
  values: { [key: string]: string };
}

const VariantDropdown: FC<VariantDropdownProps> = ({ values }) => {
  const options = Object.values(values);
  return (
    <div className="mb-3 mt-3">
      <div
        className="font-weight-bold inlineDiv mr-5"
        style={{ fontSize: "1.2rem" }}
      >
        Select an NFR Variant
      </div>
      <div className="inlineDiv">
        <select>
          {options.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VariantDropdown;
