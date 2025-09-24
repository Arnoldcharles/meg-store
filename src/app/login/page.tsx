"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/lib/firebaseConfig";

export default function LoginPage() {
  const { user, login, signup, loginWithGoogle, logout, resendVerification } =
    useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Auto redirect when verified
  useEffect(() => {
    if (user?.emailVerified) {
      router.push("/");
    }
  }, [user, router]);

  // Refresh user state to catch verification updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }
    }, 3000); // check every 3s
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(email, password);
        setMessage("Verification email sent. Please check your inbox/spam. Once verified, you can log in.");
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification();
      setMessage("Verification email resent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl overflow-hidden w-11/12 md:w-3/4 lg:w-2/3 flex flex-col md:flex-row"
      >
        {/* Left Side Image */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 p-6">
          <Image
            src="/auth.png"
            alt="Login Illustration"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm mb-2 text-center">{message}</p>
          )}

          {!user || !user.emailVerified ? (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-500 transition"
                >
                  {isSignup ? "Sign Up" : "Login"}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-2 text-gray-500 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              {/* Google Login */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 py-3 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                <FcGoogle className="text-xl" />
                <span className="font-medium">Continue with Google</span>
              </motion.button>

              {/* Toggle Signup/Login */}
              <p className="text-center text-sm text-gray-600 mt-6">
                {isSignup
                  ? "Already have an account?"
                  : "Don’t have an account?"}{" "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg text-yellow-600 font-semibold">
                Please verify your email to continue.
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={handleResend}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
                >
                  Resend Email
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
