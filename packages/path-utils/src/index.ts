export type PathJoiner = (...paths: string[]) => string;

export function generateTimestampedFileName(
  extension: string,
  date: Date,
): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString(10).padStart(2, "0");
  const day = date.getDate().toString(10).padStart(2, "0");
  const hours = date.getHours().toString(10).padStart(2, "0");
  const minutes = date.getMinutes().toString(10).padStart(2, "0");
  const seconds = date.getSeconds().toString(10).padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString(10).padStart(3, "0");
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}.${extension}`;
}

export function normalizeFileName(
  extension: string,
  getCurrentDate: () => Date,
  fileName?: string,
): string {
  if (fileName === undefined) {
    return generateTimestampedFileName(extension, getCurrentDate());
  }

  if (!fileName.endsWith(`.${extension}`)) {
    return `${fileName}.${extension}`;
  }

  return fileName;
}
