"use client";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination";
import { getTasks, Task } from "../actions/tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchTasks = async (page: number = 1) => {
    try {
      setLoading(true);
      const { results, count } = await getTasks(page);
      setTasks(results);
      setCurrentPage(page);
      setTotalCount(count);
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-[1200px]">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Tasks</h1>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p>No task created yet...</p>
        )}

        {!loading && !error && tasks && tasks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg bg-white p-4 shadow hover:shadow-md transition"
              >
                <h2 className="text-lg mb-2 font-semibold">{task.title}</h2>
                <p className="text-sm mb-2 text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-400">
                  Due date: {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <Pagination
          count={totalCount}
          currentPage={currentPage}
          onPageChange={fetchTasks}
        />
      </div>
    </div>
  );
}
