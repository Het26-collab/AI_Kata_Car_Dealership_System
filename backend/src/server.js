const PORT = process.env.PORT || 4000;
import { app } from "./app.js";

app.listen(PORT, () => {
  console.log(`DriveFlow backend listening on http://localhost:${PORT}`);
});
