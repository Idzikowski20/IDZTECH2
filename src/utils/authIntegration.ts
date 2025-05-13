
// This file is now a placeholder for future Sanity.io auth integration
import { User } from './authTypes';

export const fetchUsers = async () => {
  console.log("User fetching is currently disabled");
  return [];
};

// Add the missing fetchAllUsers function that was being referenced
export const fetchAllUsers = async () => {
  console.log("User fetching is currently disabled");
  return [];
};

export const updateUserRole = async (userId: string, role: string) => {
  console.log("User role update is currently disabled");
  return null;
};

export const deleteUser = async () => {
  console.log("User deletion is currently disabled");
  return null;
};

// Add missing addUser function
export const addUser = async (userData: any, password: string) => {
  console.log("User addition is currently disabled");
  return null;
};
