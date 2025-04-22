"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { login, signup } from "@/lib/services/api";
import { setToken } from "@/lib/redux/slices/authSlice";

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    githubAccessKey: "",
    password: "",
  });

  const handleSubmit = async (type: "login" | "signup") => {
    setIsLoading(true);
    try {
      if(type === 'signup') {
        const res = await signup({ username: formData.username, password: formData.password, githubAccessKey: formData.githubAccessKey });
        const token = res.data.data.accessToken;
        dispatch(setToken(token));
        router.push("/pr-analysis");
      } else {
        const res = await login({ username: formData.username, password: formData.password });
        const token = res.data.data.accessToken;
        dispatch(setToken(token));
        router.push("/pr-analysis");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleSubmit("login")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.username}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="github_access_key"
                    type="text"
                    placeholder="Github access key"
                    onChange={handleChange}
                    value={formData.password}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleSubmit("signup")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}