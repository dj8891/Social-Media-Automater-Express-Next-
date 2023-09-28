import * as z from "zod";

export const formSchema = z.object({
  period: z.enum([
    "everyday",
    "everySunday",
    "everyMonday",
    "everyTuesday",
    "everyWednesday",
    "everyThursday",
    "everyFriday",
    "everySaturday",
    "everyMonth",
  ]),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // Valid time format (HH:mm)
  file: z.string().refine(
    (value) => {
      const fileType = value.split(".").pop()?.toLowerCase();
      return fileType === "png" || fileType === "jpeg" || fileType === "jpg";
    },
    {
      message: "Invalid file type. Only PNG and JPEG files are allowed.",
    }
  ),
});
