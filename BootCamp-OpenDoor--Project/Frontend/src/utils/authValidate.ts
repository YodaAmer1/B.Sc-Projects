interface ValidateParams{
    username: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
}

export const validateRegisterForm = ({username,email,role,password,confirmPassword}: ValidateParams) => {
  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 4) {
    return "Username must contain at least 4 characters";
  }

  if (!email) {
    return "Email is required";
  }

  if (!role) {
    return "Please select a role";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  if (password !== confirmPassword) {
    return "Password and confirm password must be the same";
  }

  return "";
};