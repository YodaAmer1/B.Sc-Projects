import { atom } from "recoil";

// Create a new atom to store the crypto news
export const cryptoNews = atom({
  key: "cryptoNews",
  default: {
    data: [], // Array to store the data
    filterdData: [], // Array to store the filtered data
    updatedTime: null, // Time when the data was last updated
  },
});
