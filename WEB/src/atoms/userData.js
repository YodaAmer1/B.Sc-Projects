import { atom } from "recoil";

// Create a new atom to store the user data
export const userData = atom({
  key: "userData",
  default: {
    uid: "",
    email: "",
    phone: "",
    displayName: "",
    photoURL: "",
    createdAt: "",
    wallet: [],
    transactions: [],
  },
});
