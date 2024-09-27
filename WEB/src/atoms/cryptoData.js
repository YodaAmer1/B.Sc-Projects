import { atom } from "recoil";

// Create a new atom to store the crypto data
export const cryptoData = atom({
  key: "cryptoData",
  default: {
    data: [], // Array to store the data
    filterdData: [], // Array to store the filtered data
    updatedTime: null, // Time when the data was last updated
  },
});
