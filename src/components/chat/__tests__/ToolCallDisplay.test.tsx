import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay, getToolMessage } from "../ToolCallDisplay";

afterEach(() => {
  cleanup();
});

test("getToolMessage returns correct message for str_replace_editor create command", () => {
  const message = getToolMessage("str_replace_editor", {
    command: "create",
    path: "/components/Button.tsx",
  });
  expect(message).toBe("Created Button.tsx");
});

test("getToolMessage returns correct message for str_replace_editor str_replace command", () => {
  const message = getToolMessage("str_replace_editor", {
    command: "str_replace",
    path: "/App.jsx",
  });
  expect(message).toBe("Edited App.jsx");
});

test("getToolMessage returns correct message for str_replace_editor insert command", () => {
  const message = getToolMessage("str_replace_editor", {
    command: "insert",
    path: "/utils/helpers.ts",
  });
  expect(message).toBe("Edited helpers.ts");
});

test("getToolMessage returns correct message for str_replace_editor view command", () => {
  const message = getToolMessage("str_replace_editor", {
    command: "view",
    path: "/README.md",
  });
  expect(message).toBe("Viewing README.md");
});

test("getToolMessage returns correct message for file_manager rename command", () => {
  const message = getToolMessage("file_manager", {
    command: "rename",
    path: "/old-file.tsx",
    new_path: "/new-file.tsx",
  });
  expect(message).toBe("Renamed old-file.tsx → new-file.tsx");
});

test("getToolMessage returns correct message for file_manager delete command", () => {
  const message = getToolMessage("file_manager", {
    command: "delete",
    path: "/temp/unused.tsx",
  });
  expect(message).toBe("Deleted unused.tsx");
});

test("getToolMessage returns tool name for unknown tools", () => {
  const message = getToolMessage("unknown_tool", { some: "args" });
  expect(message).toBe("unknown_tool");
});

test("ToolCallDisplay renders loading state when tool is in progress", () => {
  const tool = {
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "pending",
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Created App.jsx")).toBeDefined();
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("ToolCallDisplay renders completed state when tool has result", () => {
  const tool = {
    toolName: "str_replace_editor",
    args: { command: "create", path: "/components/Card.tsx" },
    state: "result",
    result: "File created successfully",
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Created Card.tsx")).toBeDefined();
  const completedIndicator = document.querySelector(".bg-emerald-500");
  expect(completedIndicator).toBeDefined();
});

test("ToolCallDisplay extracts filename from nested path", () => {
  const tool = {
    toolName: "str_replace_editor",
    args: { command: "create", path: "/src/components/ui/Button.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolCallDisplay tool={tool} />);

  expect(screen.getByText("Created Button.tsx")).toBeDefined();
});
