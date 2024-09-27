import { atom } from "recoil";

// Create a new atom to store the web settings
export const webSettings = atom({
  key: "webSettings",
  default: {
    theme: "light", // Theme of the web
  },
});
