import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

import { signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signUp - happy path", () => {
    test("signs up successfully and redirects to existing project", async () => {
      const mockProject = { id: "project-123", name: "Test Project" };

      vi.mocked(signUpAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([mockProject]);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        const response = await result.current.signUp(
          "test@example.com",
          "password123"
        );
        expect(response).toEqual({ success: true });
      });

      expect(signUpAction).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(getProjects).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/project-123");
      expect(result.current.isLoading).toBe(false);
    });

    test("signs up successfully and creates new project when none exist", async () => {
      const mockNewProject = { id: "new-project-456", name: "New Design" };

      vi.mocked(signUpAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(null);
      vi.mocked(getProjects).mockResolvedValue([]);
      vi.mocked(createProject).mockResolvedValue(mockNewProject as any);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const response = await result.current.signUp(
          "newuser@example.com",
          "securepass123"
        );
        expect(response).toEqual({ success: true });
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^New Design #\d+$/),
        messages: [],
        data: {},
      });
      expect(mockPush).toHaveBeenCalledWith("/new-project-456");
    });

    test("signs up successfully and migrates anonymous work", async () => {
      const mockAnonWork = {
        messages: [{ role: "user", content: "Build a button" }],
        fileSystemData: { "/App.tsx": { type: "file", content: "code" } },
      };
      const mockProject = { id: "migrated-project-789" };

      vi.mocked(signUpAction).mockResolvedValue({ success: true });
      vi.mocked(getAnonWorkData).mockReturnValue(mockAnonWork);
      vi.mocked(createProject).mockResolvedValue(mockProject as any);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("user@example.com", "password123");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^Design from /),
        messages: mockAnonWork.messages,
        data: mockAnonWork.fileSystemData,
      });
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/migrated-project-789");
    });
  });
});
