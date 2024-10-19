import { Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { httpRequestStatus, imageType } from "./constants";
import { CreateGameCategoryResponseDto } from "./dto/createGameCategoryDto";
import LoadingSpiner from "./widgets/LoadingSpinner";
export function passwordStrength(password: string) {
  let score = 0;

  // Define criteria and their corresponding score increments
  const criteria = [
    { regex: /[a-z]/, score: 1 }, // Lowercase letters
    { regex: /[A-Z]/, score: 1 }, // Uppercase letters
    { regex: /\d/, score: 1 }, // Digits
    { regex: /[@$!%*?&#`~"'±§|/]/, score: 1 }, // Special characters
    { regex: /.{8,}/, score: 0 }, // Minimum length of 8 characters (considered as a baseline requirement)
  ];

  // Evaluate each criterion
  criteria.forEach((criterion) => {
    if (criterion.regex.test(password)) {
      score += criterion.score;
    }
  });

  // Ensure score does not exceed 4
  return Math.min(score, 4);
}

export const uploadImageToStorage = async ({
  file,
  path,
}: {
  file: File;
  path: imageType;
}): Promise<string> => {
  try {
    const storage = getStorage();
    const uuid = uuidv4();

    const imagePath = `${path}/${uuid}`;
    const storageRef = ref(storage, imagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    throw "Error uploading image";
  }
};

export function convertFirebaseTimestampToDate(timestamp: Timestamp): string {
  // Convert the Firebase timestamp to a JavaScript Date object
  const date = timestamp.toDate();

  // Format the date to a human-readable string
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
}

export function normalizePhoneNumber(value: string): string {
  if (value.startsWith("09") || value.startsWith("07")) {
    return `+251${value.substring(1)}`;
  } else if (value.startsWith("251")) {
    return `+${value}`;
  } else if (value.startsWith("9") || value.startsWith("7")) {
    return `+251${value}`;
  } else if (value.startsWith("+251")) {
    return value;
  } else {
    return value; // This shouldn't happen if regex catches all cases
  }
}

export const getTableContentForGameCategory = ({
  fetchStatus,
  response,
  deleteLoading,
  onDelete,
}: {
  fetchStatus: httpRequestStatus;
  response?: CreateGameCategoryResponseDto[];
  deleteLoading: Record<string, boolean>;
  onDelete: (id: string) => void;
}) => {
  if (fetchStatus === "loading") {
    return (
      <tr>
        <td className="p-5 text-center bg-purple-50" colSpan={8}>
          <div className=" flex justify-center items-center py-12">
            <LoadingSpiner dimension={30} />
          </div>
        </td>
      </tr>
    );
  } else if (response && response.length === 0) {
    return (
      <tr>
        <td className="p-5 text-center bg-purple-50" colSpan={8}>
          <p className="font-[600] text-gray-500 py-12">No category for now</p>
        </td>
      </tr>
    );
  } else {
    return response?.map((item, index) => (
      <tr key={index} className="text-center">
        <td className="p-3">
          <input type="checkbox" />
        </td>
        <td className="p-3">{item.id}</td>
        {/* max-w-[15rem] */}
        <td className="p-3 flex flex-col justify-start items-start  text-start">
          <span className="block">• {item.title.en}</span>
          <span className="block">• {item.title.am}</span>{" "}
        </td>
        <td className="p-3">{item.winningPrize}</td>
        <td className="p-3">{item.secondPlacePrize}</td>
        <td className="p-3">{item.thirdPlacePrize}</td>
        <td className="p-3">{item.ticketPrice}</td>
        <td className="p-3">{item.numberOfTicket}</td>
        <td className="p-3">
          {/* Add edit button or action */}
          <button className="bg-blue-500 text-white p-1 rounded">Edit</button>
        </td>
        <td className="p-3">
          {/* Add delete button or action */}
          <button
            type="button"
            onClick={() => {
              onDelete(item.id);
            }}
            className="bg-red-500 text-white p-1 rounded w-[3.4rem] h-full"
          >
            {deleteLoading[item.id] ? (
              <LoadingSpiner
                dimension={20}
                forgroundColor="#9a0ae4"
                backgroundColor="white"
              />
            ) : (
              "Delete"
            )}
          </button>
        </td>
      </tr>
    ));
  }
};

export function parseValidationErrors(
  errors: Record<string, string[]>
): string {
  let parsedMessage = "";

  for (const [field, messages] of Object.entries(errors)) {
    const fieldErrors = messages.join(" ");

    parsedMessage += `${fieldErrors}\n`;
  }

  return parsedMessage.trim();
}

export function handleErrorResponse(error: any) {
  if (error?.status === 422) {
    return parseValidationErrors(error?.data?.error);
  } else if (error?.status === 500) {
    return "Something went wrong on our side. Please try again later.";
  } else {
    return error?.message || "An unknown error occurred. Please try again.";
  }
}
//api helpers
