import ReactPaginate from "react-paginate";

export default function CustomePagination({
  pageCount,
  handlePageClick,
}: {
  pageCount: number;
  handlePageClick: (event: { selected: number }) => void;
}) {
  return (
    <div className="w-full  flex ">
      <ReactPaginate
        className="flex flex-wrap mx-auto my-4 md:my-8 items-center gap-2"
        pageLinkClassName=" h-max w-max px-4 py-2  rounded-xl flex items-center justify-center hover:bg-purple hover:text-white cursor-pointer transition-all ease-in-out border-2  "
        activeLinkClassName=" bg-purple text-white mx-2 px-4 py-2 border-2 border-purple "
        breakLabel="..."
        breakLinkClassName=" h-max w-max p-2 flex items-center justify-center border-2 border-black "
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLinkClassName="  h-[40px]  mx-4 flex items-center justify-center "
        nextLinkClassName="   h-[40px]  mx-4 flex items-center justify-center"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
