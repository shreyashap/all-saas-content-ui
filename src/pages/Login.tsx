import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/user-api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const loginUserMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await loginUser(data);
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.data));
      toast.success("Login successful");
      navigate("/env-select");
      reset();
    },
    onError: (err: AxiosError) => {
      if (err.status === 500) {
        toast.error("Login failed | Invalid credentials");
      } else if (err.status === 400) {
        toast.error("Field validation error");
      } else {
        toast.error("Login failed | Try again later");
        console.error(err);
      }
    },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    loginUserMutation.mutate(data);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-4 box-border font-sans
                 bg-gradient-to-br from-blue-100 via-purple-100"
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .login-card {
          animation: fadeIn 0.8s ease-out;
        }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #fff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
          margin-left: 0.5rem;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <Card className="w-full max-w-lg login-card shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label className="ml-1 my-2 text-md">Email</Label>
              <Input
                type="email"
                {...register("email")}
                id="email"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative">
              <Label className="ml-1 my-2 text-md">Password</Label>
              <Input
                type={`${showPassword ? "text" : "password"}`}
                id="password"
                {...register("password")}
                placeholder="Password"
                required
              />
              {showPassword ? (
                <EyeOff
                  className="text-slate-900 absolute top-11.5 right-2 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="text-slate-900 absolute top-11.5 right-2 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <Button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg text-lg font-semibold
                         bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                         shadow-lg shadow-indigo-500/40
                         transition-all duration-300 ease-in-out
                         hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/50
                         active:translate-y-0 active:shadow-md active:shadow-indigo-500/30
                         flex items-center justify-center"
            >
              {loginUserMutation.isPending ? (
                <Loader className="w-5 h-5 text-white" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {/* <p className="text-gray-500 text-sm mt-6">
            <a href="#" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </p> */}
          {/* <p className="text-gray-500 text-sm mt-2">
            Don't have an account?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Sign Up
            </a>
          </p> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
