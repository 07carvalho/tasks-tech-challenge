"use client";
import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number; // em ms
  onClose?: () => void;
};

const colors: Record<NonNullable<ToastProps["type"]>, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
  warning: "bg-yellow-500 text-white",
};

export default function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className={`flex items-center rounded-lg px-4 py-3 shadow-lg ${colors[type]}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
