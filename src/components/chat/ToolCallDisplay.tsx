"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

interface ToolCallDisplayProps {
  tool: ToolInvocation;
}

function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

export function getToolMessage(toolName: string, args: Record<string, unknown>): string {
  if (toolName === "str_replace_editor") {
    const command = args.command as string;
    const path = args.path as string;
    const fileName = getFileName(path);

    switch (command) {
      case "view":
        return `Viewing ${fileName}`;
      case "create":
        return `Created ${fileName}`;
      case "str_replace":
      case "insert":
        return `Edited ${fileName}`;
      default:
        return `${fileName}`;
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string;
    const path = args.path as string;
    const fileName = getFileName(path);

    switch (command) {
      case "rename":
        const newPath = args.new_path as string;
        const newFileName = getFileName(newPath);
        return `Renamed ${fileName} → ${newFileName}`;
      case "delete":
        return `Deleted ${fileName}`;
      default:
        return `${fileName}`;
    }
  }

  return toolName;
}

export function ToolCallDisplay({ tool }: ToolCallDisplayProps) {
  const isComplete = tool.state === "result" && tool.result;
  const message = getToolMessage(tool.toolName, tool.args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
