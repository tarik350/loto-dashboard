import { useState, useEffect } from "react";

const useCheckboxState = (items: number[]) => {
  const [isChecked, setIsChecked] = useState<Record<number, boolean>>({});

  // Generic function to set all checkboxes to the specified boolean value
  const setAllCheckboxes = (checked: boolean) => {
    setIsChecked(
      items.reduce<Record<number, boolean>>((prev, current) => {
        prev[current] = checked;
        return prev;
      }, {})
    );
  };

  // Toggle checkbox state for a specific item
  const toggleCheckbox = (id: number) => {
    setIsChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllChecked = (): boolean => {
    return items.every((item) => isChecked[item] === true);
  };

  // On mount, initialize checkboxes to false
  useEffect(() => {
    setAllCheckboxes(false);
  }, [items]);

  return {
    isChecked,
    setAllCheckboxes, // Now you can use this for both reset and checking all
    toggleCheckbox,
    isAllChecked,
  };
};

export default useCheckboxState;
