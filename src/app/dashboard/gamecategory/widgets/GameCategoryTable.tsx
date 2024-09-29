export default function GameCategoryTable() {
  return (
    <table className="min-w-full table-auto border-collapse border-spacing-0 mt-6 category-table">
      <thead>
        <tr className=" text-white bg-purple rounded-xl text-center">
          <th className="p-3  ">Title</th>
          <th className="p-3  ">Description</th>
          <th className="p-3  ">Winning prize</th>
          <th className="p-3  ">2nd place prize</th>
          <th className="p-3  ">3rd place prize</th>
          <th className="p-3  ">Ticket price</th>
          <th className="p-3  ">Total Tickets</th>

          <th className="p-3   w-10"></th>
          <th className="p-3   w-10"></th>
        </tr>
      </thead>
      <tbody className=" border-b-2 ">
        <tr>
          <td className="p-5 text-center  bg-purple-50" colSpan={9}>
            <p className=" font-[600] text-gray-500  ">No category for now</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
