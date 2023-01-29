import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Login = () => {
  const { signInWithGoogle, signInWithGithub, signIn, user, isLoading } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.push("/");
  }, [user, isLoading]);

  if (!isLoading && user) return null;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl h-2/3 bg-white rounded-lg p-12 shadow">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-lg mt-2">Sign In to Thullo and start working!</p>
        <div className="flex flex-col space-y-4 mt-12">
          <button
            className="text-center w-full py-3 rounded-full bg-gray-200 text-black font-semibold"
            onClick={signInWithGoogle}
          >
            Continue with Google
          </button>
          <button
            className="text-center w-full py-3 rounded-full bg-gray-500 text-white font-semibold"
            onClick={signInWithGithub}
          >
            Continue with Github
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
  );
};

export default Login;
