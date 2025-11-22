import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
// import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Handles form submission by preventing the default action and logging in the user using the provided form data.
 * @param {React.FormEvent} e - The form submission event.
/*******  80bf180d-cecb-482c-a57e-338d7d59e437  *******/
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
    <div className="inline-block bg-blue-200/30 rounded-xl shadow p-8">  
        <div className="flex flex-col justify-center items-center space-y-4">
            {/* HEADING TEXT */}
            <div className="flex flex-col items-center">
                <MessageCircleIcon/>
                <h2>Welcome Back</h2>
                <p>Login to access to your account</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* EMAIL INPUT */}
                   
                <div className="items-start space-y-2 border-b-2 p-4">
                    <label className="w-full">Email</label>
                    <div className="flex space-x-2">
                        <MailIcon />

                        <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input px-2 rounded-md"
                        placeholder="johndoe@gmail.com"
                        />
                    </div>
                </div>
                

                {/* PASSWORD INPUT */}
                <div className="items-start space-y-2 border-b-2 p-4">
                    <label>Password</label>
                    <div className="flex space-x-2">
                        <LockIcon />

                        <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input px-2 rounded-md"
                        placeholder="Enter your password"
                        />
                    </div>
                </div>

                <button type="submit" disabled={isLoggingIn} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ">
                {isLoggingIn ? (
                    <LoaderIcon />
                ) : (
                    "Sign In"
                )}
                </button>
            </form>

            <div className="flex">
                <p>Don't have an account?</p>
                <Link to="/signup" className="text-sky-600 px-1 hover:text-sky-900">
                Sign Up
                </Link>
            </div>
        </div>
    </div>
    </div>
  );
}
export default LoginPage;