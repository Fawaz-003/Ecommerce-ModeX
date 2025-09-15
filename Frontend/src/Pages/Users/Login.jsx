import React, { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../Context/AppContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();
  const { axios, navigate } = useAppContext();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const res = await axios.post(
        "/api/users/login",
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = res.data; // axios automatically parses JSON

      localStorage.setItem("user-token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(data.message);

      setForm({ email: "", password: "" });

      setTimeout(() => {
        if (data.user.role === 1) {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      });
    } catch (err) {
      // axios errors: prefer err.response?.data?.message if available
      toast.error(err.response?.data?.message || err.message || "Login failed");

      setForm({ email: "", password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Welcome You
        </h1>
        <p className="text-s text-center mb-2 text-gray-700">
          Login to your account to continue shopping...
        </p>
        <h2 className="text-xl font-bold text-center mb-8 text-gray-900">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <Mail className="mr-5 text-gray-800" />
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <Lock className="mr-5 text-gray-800" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-[50%] text-lg my-2 text-white py-2 rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-800 hover:bg-purple-700"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin" size={20} /> Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-2">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
