import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import z from "zod";

// Create a generic hook that accepts a dynamic schema
export const useZodForm = <T extends z.ZodTypeAny>(
  schema: T,
  defaultValues?: DefaultValues<z.infer<T>> | undefined
) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  return {
    register,
    errors,
    handleSubmit,
    watch,
    reset,
  };
};
