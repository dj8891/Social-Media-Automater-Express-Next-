import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const searchFormSchema = z.object({
  search: z.string(),
});
