import { app } from "./src/app.js";
import { PORT } from "./env.js";

const port = PORT || 88000;
app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});
