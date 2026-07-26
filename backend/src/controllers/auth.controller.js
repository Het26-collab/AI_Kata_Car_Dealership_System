import * as authService from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const errors = authService.validateRegistration(req.body || {});
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const user = await authService.registerUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }

    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const errors = authService.validateLogin(req.body || {});
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const authResult = await authService.loginUser(req.body);
    res.json({ data: authResult });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }

    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const result = await authService.forgotPassword(email);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}
