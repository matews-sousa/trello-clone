import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Login = () => {
  const { signInWithGoogle, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.push("/");
  }, [user, isLoading]);

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
          <button className="text-center w-full py-3 rounded-full bg-gray-500 text-white font-semibold">
            Continue with Github
          </button>
          <button className="text-center w-full py-3 rounded-full bg-blue-500 text-white font-semibold">
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
