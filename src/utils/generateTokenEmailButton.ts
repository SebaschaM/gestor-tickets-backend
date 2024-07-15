import { v4 as uuidv4 } from "uuid";

export const generateTokenEmailButton = (): string => {
  const uuid = uuidv4();
  return uuid;
};
