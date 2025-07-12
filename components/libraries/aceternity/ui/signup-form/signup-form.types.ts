import { ReactNode } from "react";

export interface SignupFormProps {
  className?: string;
  onSubmit?: (data: SignupFormData) => void;
}

export interface SignupFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  twitterpassword: string;
}

export interface LabelInputContainerProps {
  children: ReactNode;
  className?: string;
}