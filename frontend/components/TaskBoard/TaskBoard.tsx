"use client";
import { Task } from "@/app/actions/tasks";
import { useState, useEffect } from "react";

type TaskBoardProps = {
  tasks: Task[];
};

const statusLabels: Record<Task["status"], string> = {
  P: "Pending",
  I: "In Progress",
  C: "Completed",
};

export default function TaskBoard({ tasks }: TaskBoardProps) {
  const [columns, setColumns] = useState<Record<Task["status"], Task[]>>({
    P: [],
    I: [],
    C: [],
  });

  useEffect(() => {
    const grouped: Record<Task["status"], Task[]> = { P: [], I: [], C: [] };
    tasks.forEach((task) => grouped[task.status].push(task));
    setColumns(grouped);
  }, [tasks]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-[600px]">
        {(["P", "I", "C"] as Task["status"][]).map((status) => (
          <div key={status} className="flex-1 min-w-[200px] bg-gray-100 rounded-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">{statusLabels[status]}</h2>
            <div className="flex flex-col gap-3">
              {columns[status].map((task) => (
                <div
                  key={task.id}
                  className="rounded-md bg-white p-3 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-400 mt-1">Due: {task.due_date}</p>
                </div>
              ))}
              {columns[status].length === 0 && (
                <p className="text-sm text-gray-400">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
