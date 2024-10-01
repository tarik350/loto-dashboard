import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { Timestamp } from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";
import { imageType } from "./constants";
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
