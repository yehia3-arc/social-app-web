import * as zod from "zod"; // * means import all in zod

export const RegisterSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is required")
      .min(3, "min length is 3 chars")
      .max(15, "max length is 15 chars"),

    email: zod
      .email()
      .nonempty("email is required")
      .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/),
    dateOfBirth: zod
      .string()
      .nonempty("date is required")
      .refine((dateOfBirthValue) => {
        const userDate = new Date(dateOfBirthValue).getFullYear(); //user year
        const nowDate = new Date().getFullYear(); // now year
        return nowDate - userDate > 10 ? true : false;
      }, "Date should be less than ==> 2015"),
    gender: zod.enum(["male", "female"]),
    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (#?!@$%^&*-)",
      ),
    rePassword: zod.string().nonempty("repassword is required"),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        //okay
        return true;
      } else {
        // error message
        return false;
      }
    },
    {
      path: ["rePassword"],
      error: "password and rePassword not match",
    },
  );

export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;

//------------------------------------------------
export const LoginSchema = zod.object({
  email: zod
    .email()
    .nonempty("email is required")
    .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/),

  password: zod
    .string()
    .nonempty("password is required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (#?!@$%^&*-)",
    ),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;
