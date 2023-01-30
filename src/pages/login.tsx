import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const loginSchema = z.object({
  email: z.string().email("Email must be a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const { signInWithGoogle, signInWithGithub, signIn, user, isLoading } =
    useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const notify = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.email, data.password);
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          notify("User not found");
          break;
        case "auth/wrong-password":
          notify("Wrong credentials");
          break;
        default:
          notify("Something went wrong");
          break;
      }
    }
  };

  useEffect(() => {
    if (!isLoading && user) router.push("/");
  }, [user, isLoading]);

  if (!isLoading && user) return null;

  return (
    <>
      <Head>
        <title>Thullo | Login</title>
        <link rel="icon" href="/Logo-small.svg" />
      </Head>
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 px-2">
        <ToastContainer />
        <img src="/Logo.svg" className="w-44 mb-6" />
        <div className="w-full max-w-lg min-h-2/3 bg-white rounded-lg p-6 shadow">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-lg mt-2">Sign In to Thullo and start working!</p>
          <form
            className="mt-10 flex flex-col space-y-4 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full">
              <input
                {...register("email")}
                type="text"
                placeholder="Email"
                className="input"
              />
              <p className="text-xs text-red-400">{errors.email?.message}</p>
            </div>
            <div className="w-full">
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="input"
              />
              <p className="text-xs text-red-400">{errors.password?.message}</p>
            </div>
            <button
              className="text-center w-full py-3 rounded-full bg-blue-400 text-white font-semibold disabled:bg-opacity-75 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Login
            </button>
          </form>
          <div className="flex items-center gap-2 my-6">
            <div className="flex-1 h-[1px] bg-gray-400"></div>
            <p className="text-gray-400">OR</p>
            <div className="flex-1 h-[1px] bg-gray-400"></div>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              className="text-center w-full py-3 rounded-md bg-white shadow-md text-black ring-1 ring-gray-300 font-semibold flex items-center justify-center gap-2"
              onClick={signInWithGoogle}
            >
              <FcGoogle className="h-6 w-6" />
              <span>Continue with Google</span>
            </button>
            <button
              className="text-center w-full py-3 rounded-md bg-gray-900 shadow-md text-white font-semibold flex items-center justify-center gap-2"
              onClick={signInWithGithub}
            >
              <FaGithub className="h-6 w-6" />
              <span>Continue with Github</span>
            </button>
          </div>
          <p className="text-center text-gray-500 mt-6">
            Do not have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-400 underline hover:text-blue-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
