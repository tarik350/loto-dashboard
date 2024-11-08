import { useState } from "react";
import { BiFilter } from "react-icons/bi";

interface SearchWithDropdownProps<T extends string> {
  onSearch: (query: string) => void;
  queryBy: T;
  setQueryBy: (value: T) => void;
  dropdownList: T[];
}

function SearchWithDropdown<T extends string>({
  onSearch,
  queryBy,
  setQueryBy,
  dropdownList,
}: SearchWithDropdownProps<T>) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex items-center space-x-0">
      <input
        type="text"
        className="border-2 border-purple-500 w-full rounded-l-xl px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none transition-all duration-300 ease-in-out h-[3rem]"
        onChange={(event) => {
          onSearch(event.target.value); // This method will be passed from the parent component
        }}
        placeholder="Search..."
      />
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowDropdown(!showDropdown); // Toggle dropdown visibility
          }}
          className="h-[3rem] bg-softLavender text-black rounded-r-xl w-max px-4 flex gap-2 justify-center items-center font-semibold hover:bg-purple-700 transition-all duration-300 ease-in-out"
        >
          <p>{queryBy}</p>
          <BiFilter />
        </button>
        {showDropdown && (
          <ul className="absolute min-w-max bg-purple-600 bg-softLavender text-black font-semibold w-full mt-2 border-2 border-purple-500 rounded-xl">
            {dropdownList.map((value, index) => (
              <li
                key={index}
                onClick={() => {
                  setQueryBy(value); // Set the selected value
                  setShowDropdown(false); // Close the dropdown after selection
                }}
                className={`${
                  index !== dropdownList.length - 1 && "border-b border-white"
                } py-[.75rem] px-4 cursor-pointer hover:bg-purple-700 hover:text-purple transition-all duration-150 ease-in-out`}
              >
                {value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default SearchWithDropdown;
