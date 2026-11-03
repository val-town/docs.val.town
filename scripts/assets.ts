import { Hono } from "hono";
import { styles } from "../routes/styles";
import { searchIndex } from "../routes/search";
const app = new Hono();
app.get("/styles.css", styles);
app.get("/search-index.json", searchIndex);
export default app;
