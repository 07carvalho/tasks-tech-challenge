"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signup, SignupErrorResponse, SignupResponse } from "../actions/signup";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignupErrorResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setIsSubmitting(true);

    const result: SignupResponse = await signup(formData);

    if (result.success) {
      router.push("/home");
    } else if (result.errors) {
      setErrors(result.errors);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-3">
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 mb-1"
            />
            {errors && errors.first_name && <p className="text-sm text-red-600">{errors.first_name.join(", ")}</p>}
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 mb-1"
            />
            {errors && errors.last_name && <p className="text-sm text-red-600">{errors.last_name.join(", ")}</p>}
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 mb-1"
            />
            {errors && errors.email && <p className="text-sm text-red-600">{errors.email.join(", ")}</p>}
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 mb-1"
            />
            {errors && errors.password && <p className="text-sm text-red-600">{errors.password.join(", ")}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 cursor-pointer p-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/" className="font-medium text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}
