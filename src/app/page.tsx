// "use client";

// import { winningTicketApi } from "@/store/apis/winningTicketApi";
// import Skeleton from "react-loading-skeleton";
// import style from "@/styles/table.module.css";
// import CustomePagination from "@/utils/widgets/CustomePagination";
// import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
// import { FaSort } from "react-icons/fa";
// import GameDetails from "@/utils/widgets/GameDetailCard";
// import videoPreviewStyles from "@/styles/modalform.module.css";
// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import buttonStyle from "@/styles/CustomButton.module.css";
// import { useForm } from "react-hook-form";
// import LoadingSpiner from "@/utils/widgets/LoadingSpinner";

// type FormSchema = {
//   description: string;
// };
// export default function CompletedGameDetailPage({
//   params,
// }: {
//   params: { gameId: string };
// }) {
//   const { data, isLoading, isFetching, isSuccess, error, isError } =
//     winningTicketApi.useGetWinningTicketsForGameQuery({
//       gameId: parseInt(params.gameId),
//     });
//   const [markGameAudited, { isLoading: auditLoading }] =
//     winningTicketApi.useMarkGameAuditedMutation();
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormSchema>();
//   const onSubmitReport = (data: FormSchema) => {};
//   const onAudit = () => {
//     try {
//       const response = markGameAudited({
//         gameId: parseInt(params.gameId),
//       }).unwrap();
//       debugger;
//     } catch (error) {
//       debugger;
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen ">
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             className="modal"
//             onClick={() => {
//               setIsModalOpen(false);
//             }}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="modal-content"
//               onClick={(e) => e.stopPropagation()}
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className=" h-max min-w-[30rem] z-50 relative bg-softLavender p-12 rounded-xl">
//                 <label className=" text-[1rem] font-bold flex flex-col  ">
//                   Report Description
//                   <textarea
//                     {...register("description", { required: true })}
//                     placeholder="Please provide some description of the report."
//                     minLength={5}
//                     rows={5}
//                     className=" min-w-[20rem] text-[1rem] font-[400] p-4 mt-2"
//                   ></textarea>
//                   {errors.description && (
//                     <p className="error-message">required.</p>
//                   )}
//                 </label>
//                 <form
//                   className="  flex gap-2  mt-4"
//                   onSubmit={handleSubmit(onSubmitReport)}
//                 >
//                   <button
//                     className={`${buttonStyle.button} bg-red-500 text-white w-full h-[3rem] `}
//                     type="button"
//                     onClick={() => {
//                       setIsModalOpen(false);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className={`${buttonStyle.button} w-full bg-green text-textColor h-[3rem]`}
//                     type="submit"
//                   >
//                     Submit
//                   </button>
//                 </form>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       <div className=" m-8">
//         {isLoading && (
//           <Skeleton baseColor="#d1d5db" className="w-full h-[15rem]" />
//         )}
//         {data && <GameDetails game={data.data?.game!} />}
//         <div className={style.table__container__highlight}>
//           <div className="generic-table__header">
//             <h2>Winning Tickets</h2>
//           </div>
//           {isLoading && (
//             <Skeleton
//               baseColor="#d1d5db"
//               className="w-full h-[12rem] rounded-xl"
//             />
//           )}
//           <div className={style.table__container__fullheight}>
//             <table className={style.table}>
//               <thead className="relative z-0">
//                 <tr>
//                   <th className="sortable">
//                     <div className=" flex  items-center gap-2">
//                       <p>ID</p>
//                       <FaSort className="sort-icon" />
//                     </div>
//                   </th>
//                   <th>
//                     <div className=" flex  items-center gap-2">
//                       <p>Winner ID</p>
//                       <FaSort className="sort-icon" />
//                     </div>
//                   </th>
//                   <th>Winner Name</th>

//                   <th>Place</th>
//                   <th>winning Prize</th>
//                   <th>Winning Ticket Number</th>

//                   <th className="sortable">
//                     <div className=" flex  items-center gap-2">
//                       <p>Created At</p>
//                       <FaSort className="sort-icon" />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {renderTableBody({
//                   data: data?.data?.tickets!,
//                   isLoading: isLoading || isFetching,
//                   isError,
//                   columns: [
//                     {
//                       render(record) {
//                         return <p>{record.id}</p>;
//                       },
//                     },
//                     {
//                       render(record) {
//                         return <p>{record.ticket.owner.id}</p>;
//                       },
//                     },
//                     {
//                       render(record) {
//                         return <p>{record.ticket.owner.full_name}</p>;
//                       },
//                     },
//                     {
//                       render(record) {
//                         return <p>{record.place}</p>;
//                       },
//                     },
//                     {
//                       render(record) {
//                         const prizes = {
//                           first: data?.data?.game.category.winning_prize,
//                           second:
//                             data?.data?.game.category.second_winning_prize,
//                           third: data?.data?.game.category.third_winning_prize,
//                         };

//                         // Ensure record.place is one of the expected keys
//                         return (
//                           <p className=" font-bold">
//                             {prizes[record.place as keyof typeof prizes]} BIRR
//                           </p>
//                         );
//                       },
//                     },
//                     {
//                       render(record) {
//                         return <p>{record.ticket.ticket_number}</p>;
//                       },
//                     },
//                     {
//                       render(record) {
//                         return (
//                           <p>{formatToReadableDateTime(record.created_at)}</p>
//                         );
//                       },
//                     },
//                   ],
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         {isLoading && (
//           <Skeleton baseColor="#d1d5db" className="h-[12rem] w-1/3" />
//         )}
//         <div className={`${videoPreviewStyles.videoPreview} `}>
//           <video className={videoPreviewStyles.videoElement} controls>
//             <source
//               key={data?.data?.game.winning_video_url ?? ""}
//               src={data?.data?.game.winning_video_url ?? ""}
//               type="video/mp4"
//             />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//         <div className="flex items-center gap-2  pb-12">
//           <button
//             onClick={onAudit}
//             type="button"
//             className="bg-green text-black font-bold  rounded-full w-[12rem] h-[3rem]"
//           >
//             {auditLoading ? (
//               <LoadingSpiner dimension={30} />
//             ) : (
//               "Mark As Audited"
//             )}
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               setIsModalOpen(!isModalOpen);
//             }}
//             className="bg-primary font-bold text-white rounded-full w-[12rem] h-[3rem]"
//           >
//             Report
//           </button>
//         </div>
//       </div>

//       {/* This div will stick to the bottom */}
//     </div>
//   );
// }
