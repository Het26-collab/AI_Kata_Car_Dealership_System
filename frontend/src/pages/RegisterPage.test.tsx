import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ApiError } from "../api/client";
import { RegisterPage } from "./RegisterPage";

const registerMock = vi.fn();

vi.mock("../services/authService", () => ({
  authService: {
    register: (payload: { email: string; password: string }) => registerMock(payload),
  },
}));

function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<p>Login Screen</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RegisterPage", () => {
  beforeEach(() => {
    registerMock.mockReset();
  });

  it("submits registration payload and redirects to login on success", async () => {
    registerMock.mockResolvedValueOnce({ id: "1" });
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/email address/i), "new.user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "strongPass123");
    await user.type(screen.getByLabelText(/confirm password/i), "strongPass123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: "new.user@example.com",
        password: "strongPass123",
      });
    });

    expect(await screen.findByText("Login Screen")).toBeInTheDocument();
  });

  it("renders backend invalid email validation error inline", async () => {
    registerMock.mockRejectedValueOnce(
      new ApiError('"email" must be a valid email address.', 400, ['"email" must be a valid email address.'])
    );
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/email address/i), "bad-email");
    await user.type(screen.getByLabelText(/^password$/i), "strongPass123");
    await user.type(screen.getByLabelText(/confirm password/i), "strongPass123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText('"email" must be a valid email address.')).toBeInTheDocument();
  });

  it("renders backend weak password validation error inline", async () => {
    registerMock.mockRejectedValueOnce(
      new ApiError('"password" must be at least 8 characters.', 400, ['"password" must be at least 8 characters.'])
    );
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/email address/i), "new.user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "short");
    await user.type(screen.getByLabelText(/confirm password/i), "short");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText('"password" must be at least 8 characters.')).toBeInTheDocument();
  });

  it("renders duplicate email error inline", async () => {
    registerMock.mockRejectedValueOnce(new ApiError("A user with that email already exists.", 409));
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/email address/i), "existing.user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "strongPass123");
    await user.type(screen.getByLabelText(/confirm password/i), "strongPass123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText("A user with that email already exists.")).toBeInTheDocument();
  });
});
