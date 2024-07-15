import { v4 as uuidv4 } from 'uuid';

export const generateTicket = (): string => {
  const uuid = uuidv4(); 
  const numericPart = uuid.replace(/\D/g, ''); 
  return numericPart.slice(0, 5); 
};
