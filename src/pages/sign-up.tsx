import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be at most 20 characters"),
    email: z.string().email("Email must be a valid email address"),
    password: z.string().min(6, "Password must be at least 3 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const router = useRouter();
  const { signUp, user, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    console.log(data);
    try {
      await signUp(data.name, data.email, data.password);
    } catch (error: unknown) {
      switch (error.code) {
        case "auth/email-already-in-use":
          console.log("Email already in use");
          break;
        case "auth/invalid-email":
          console.log("Invalid email");
          break;
        case "auth/operation-not-allowed":
          console.log("Operation not allowed");
          break;
        case "auth/weak-password":
          console.log("Weak password");
          break;
        default:
          console.log("Something went wrong");
          break;
      }
    }
  };

  useEffect(() => {
    if (!isLoading && user) router.push("/");
  }, [user, isLoading]);

  if (!isLoading && user) return null;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl min-h-2/3 bg-white rounded-lg p-12 shadow">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-lg mt-2">Sign Up to Thullo and start working!</p>
        <form
          className="mt-10 flex flex-col space-y-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full">
            <input
              {...register("name")}
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
            />
            <p className="text-xs text-red-400">{errors.name?.message}</p>
          </div>
          <div className="w-full">
            <input
              {...register("email")}
              type="text"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
            />
            <p className="text-xs text-red-400">{errors.email?.message}</p>
          </div>
          <div className="w-full">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
            />
            <p className="text-xs text-red-400">{errors.password?.message}</p>
          </div>
          <div className="w-full">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
            />
            <p className="text-xs text-red-400">
              {errors.confirmPassword?.message}
            </p>
          </div>
          <button
            className="text-center w-full py-3 rounded-full bg-blue-400 text-white font-semibold disabled:bg-opacity-75 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 underline hover:text-blue-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
