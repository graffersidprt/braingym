import { string, number } from "zod";
import { strings } from "./strings";

export const emailValidation = string()
  .min(1, strings.email_is_required)
  .email(strings.valid_email_msg);

export const loginPasswordValidation = string().min(
  1,
  strings.password_is_required
);

export const passwordValidation = string()
  .min(1, strings.password_is_required)
  .min(8, strings.valid_password_min_msg)
  .max(32, strings.valid_password_max_msg);

export const createPasswordValidation = string()
  .min(1, strings.password_is_required)
  .min(8, strings.valid_password_min_msg)
  .regex(new RegExp(".*[A-Z].*"), strings.uppercase_character_required)
  .regex(new RegExp(".*[a-z].*"), strings.lowercase_character_required)
  .regex(new RegExp(".*\\d.*"), strings.number_required)
  .regex(new RegExp(".*[!@#$%^&*].*"), strings.special_character_required);

export const otpValidation = string().min(1, strings.otp_is_required);

export const fistNameValidation = string().min(1, strings.first_name_is_required).max(100, strings.first_name_max_msg);
export const genderValidation = number().min(1, strings.gender_is_required);
export const lastNameValidation = string().min(1, strings.last_name_is_required).max(100, strings.last_name_max_msg);
export const departmentValidation = string().min(1, strings.department_is_required).max(100, strings.department_max_msg);
export const positionValidation = string().min(1, strings.position_is_required).max(100, strings.position_max_msg);
export const secLangValidation = string().min(1, strings.sec_lang_is_required).max(100, strings.sec_language_max_msg);
export const aboutMeFieldValidation = string().min(1, strings.about_me_is_required).max(500, strings.about_me_max_msg);
export const countryValidation = number().min(1, strings.country_is_required);
export const primaryLanguageValidation = number().min(
  1,
  strings.primary_language_is_required
);
export const stateValidation = number().min(1, strings.state_is_required);
export const cityValidation = number();
export const genderDescribeValidation = number().min(1, strings.gender_is_required);
