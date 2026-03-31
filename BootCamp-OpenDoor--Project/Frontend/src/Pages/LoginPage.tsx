import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { decodeJwtToken, loginUser } from "@/services/auth/authService";
import {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {refreshAuth} = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try{

            const result = await loginUser({ email, password });
            localStorage.setItem("access_token", result.access_token);
            const decodedToken = decodeJwtToken(result.access_token);
            console.log("decoded token:", decodedToken);
            localStorage.setItem("email", decodedToken.email);
            localStorage.setItem("id", decodedToken.id);
            localStorage.setItem("username", decodedToken.username);
            localStorage.setItem("role", decodedToken.role);
    
            refreshAuth();
            toast.success("Login successful", {
                description: "You have signed in successfully.",
            });
            navigate(`/${decodedToken.role.toLowerCase()}`);
        }catch(e){
            const message = e instanceof Error ? e.message : "Something went wrong during login";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm">
            <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription>
                Enter your email and password to continue
            </CardDescription>
            </CardHeader>

            <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </Button>
                <div className="flex justify-between">
                <Link to="/login" className="text-blue-500 hover:text-black">
                    Forgot password?
                </Link>

                <Link to="/register" className="text-blue-500 hover:text-black">
                    Sign up
                </Link>
                </div>
            </form>
            </CardContent>
        </Card>
        </div>
    )
}