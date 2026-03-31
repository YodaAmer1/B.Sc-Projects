import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { decodeJwtToken, registerUser } from "@/services/auth/authService";
import { validateRegisterForm } from "@/utils/authValidate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {refreshAuth} = useAuth();
    const navigate = useNavigate();
    const validationError = validateRegisterForm({username,email,role,password,confirmPassword});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setIsSubmitting(true);

        try{
            const result = await registerUser({ username, email, password, role });
            localStorage.setItem("access_token", result.access_token);
            const decodedToken = decodeJwtToken(result.access_token);
            localStorage.setItem("email", decodedToken.email);
            localStorage.setItem("id", decodedToken.id);
            localStorage.setItem("username", decodedToken.username);
            localStorage.setItem("role", decodedToken.role);
    
            refreshAuth();
            toast.success("Registration successful", {
                description: "Your account has been created successfully.",
            });
            navigate(`/${decodedToken.role.toLowerCase()}`)
        }catch(e){
            const message = e instanceof Error ? e.message : "Something went wrong during login";
                toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm">
            <CardHeader>
            <CardTitle className="text-2xl text-center">Register</CardTitle>
            <CardDescription>
                Create your account to continue
            </CardDescription>
            </CardHeader>

            <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-5">
                 <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => {
                    if (value) {
                    setRole(value);
                    }
                }}>
                    <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Host">Host</SelectItem>
                    <SelectItem value="Evacuee">Evacuee</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
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

                <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing up..." : "Sign up"}
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    )
}