"use client";
import { useEffect, useState } from "react";
import { createTask, CreateTaskPayload, getTasks, Task } from "../actions/tasks";
import { TaskDialog } from "@/components/TaskDialog";
import { Toast } from "@/components/Toast";
import { TaskBoard } from "@/components/TaskBoard";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const results = await getTasks();
      setTasks(results);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (data: CreateTaskPayload) => {
    await createTask(data);
    setShowToast(true);
    await fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between align-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button
          onClick={() => setOpenCreateTaskDialog(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
        >
          New Task
        </button>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <TaskBoard tasks={tasks} />

      <TaskDialog
        open={openCreateTaskDialog}
        onClose={() => setOpenCreateTaskDialog(false)}
        onCreate={handleCreate}
      />

      {showToast && (
        <Toast
          message="Task created successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
