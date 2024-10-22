import { useEffect, useState } from "react";

interface RoleInputProps {
  onSearch: (query: string) => void;
  setShowRoles: (value: boolean) => void;
  selectedRole: {
    name: string;
  } | null;
}

export const RoleInput: React.FC<RoleInputProps> = ({
  onSearch,
  setShowRoles,
  selectedRole,
}) => {
  // Local state to manage the input value
  const [inputValue, setInputValue] = useState<string>("");

  // Update the input value when typing or when a role is selected
  useEffect(() => {
    if (selectedRole && selectedRole.name) {
      setInputValue(selectedRole.name);
    }
  }, [selectedRole]);

  return (
    <input
      onChange={(event) => {
        const newValue = event.target.value;
        setShowRoles(event.target.value.length > 0);
        setInputValue(newValue);
        onSearch(newValue);
      }}
      value={inputValue}
      type="text"
      className={selectedRole !== undefined ? "selected-dropdown" : ""}
      placeholder="Role"
    />
  );
};
