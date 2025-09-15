import React, { useState } from "react";
import { Mail, Lock, Users } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "/api/users/register",
      form,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = res.data; // axios automatically parses JSON

    toast.success(data.message);

    setForm({ name: "", email: "", password: "" });
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Registration failed");

    setForm({ name: "", email: "", password: "" });
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Welcome You
        </h1>
        <p className="text-s text-center mb-2 text-gray-700">
          Register your account to start shopping...
        </p>
        <h2 className="text-lg font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <Users className="mr-5 text-gray-800" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <Mail className="mr-5 text-gray-800" />
            <input
              type="email"
              name="email"
              placeholder="Email"
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
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="w-[50%] bg-purple-800 text-lg my-2 text-white py-2 rounded-lg hover:bg-purple-700 hover:cursor-pointer transition"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
