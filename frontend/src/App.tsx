import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { AppRoutes } from "./routes/AppRoutes";
import { CommandPalette } from "./components/CommandPalette";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CommandPalette />
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
