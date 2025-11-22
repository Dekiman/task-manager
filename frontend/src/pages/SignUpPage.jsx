import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
// import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="inline-block bg-blue-200/30 rounded-xl space-y-6 p-8">
            {/* HEADING TEXT */}
                <div className="flex flex-col items-center">
                    <MessageCircleIcon/>
                    <h2 className="">Create Account</h2>
                    <p>Sign up for a new account</p>
                </div>

            {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* FULL NAME */}
                    <div className="">
                    <label>Full Name</label>
                    <div className="flex">
                        <UserIcon/>

                        <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                        />
                    </div>
                    </div>

                    {/* EMAIL INPUT */}
                    <div>
                    <label>Email</label>
                    <div className="flex">
                        <MailIcon/>

                        <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="johndoe@gmail.com"
                        />
                    </div>
                    </div>

                    {/* PASSWORD INPUT */}
                    <div>
                    <label>Password</label>
                    <div className="flex">
                        <LockIcon/>

                        <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Enter your password"
                        />
                    </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button className="auth-btn" type="submit" disabled={isSigningUp}>
                    {isSigningUp ? (
                        <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                        "Create Account"
                    )}
                    </button>
                </form>
            <div>
                <Link to="/login">
                Already have an account? Login
                </Link>
            </div>
        </div>
    </div>
  );
}
export default SignUpPage;



