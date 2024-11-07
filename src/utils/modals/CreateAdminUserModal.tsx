import CreateAdminUserForm from "@/app/dashboard/admin/users/widgets/CreateAdminUserForm";
import ModalLayout from "./ModalLayout";

export default function CreateAdminUserModal({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <ModalLayout setIsOpen={setIsOpen}>
      <div
        style={{
          height: "90%",
        }}
        className="flex"
      >
        <CreateAdminUserForm />
      </div>
    </ModalLayout>
  );
}
