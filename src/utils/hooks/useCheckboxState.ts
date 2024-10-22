import { useState, useEffect } from "react";

const useCheckboxState = (initialEntityIds: number[]) => {
  const [isChecked, setIsChecked] = useState<Record<number, boolean>>({});
  const [entityIds, setEntityIds] = useState<number[]>(initialEntityIds);

  // Generic function to set all checkboxes for the current entities
  const setAllCheckboxes = (checked: boolean) => {
    setIsChecked(
      entityIds.reduce<Record<number, boolean>>((prev, current) => {
        prev[current] = checked;
        return prev;
      }, {})
    );
  };

  // Toggle checkbox state for a specific entity
  const toggleCheckbox = (id: number) => {
    setIsChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Check if all checkboxes are checked
  const isAllChecked = (): boolean => {
    return entityIds.every((id) => isChecked[id] === true);
  };

  // Only update checkboxes if entityIds change
  useEffect(() => {
    if (entityIds.length > 0) {
      setAllCheckboxes(false); // Reset all checkboxes to unchecked
    }
  }, [entityIds]);

  // Function to update entityIds dynamically, only if different from previous
  const updateEntityIds = (newEntityIds: number[]) => {
    const entityIdsChanged =
      newEntityIds.length !== entityIds.length ||
      newEntityIds.some((id, index) => id !== entityIds[index]);

    if (entityIdsChanged) {
      setEntityIds(newEntityIds);
    }
  };

  return {
    isChecked,
    setAllCheckboxes,
    toggleCheckbox,
    isAllChecked,
    updateEntityIds,
  };
};

export default useCheckboxState;
