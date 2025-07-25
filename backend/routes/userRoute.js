import express from "express";
import requestVerification from "../controllers/requestVerification.js";
import register from "../controllers/register.js";
import login from "../controllers/login.js";
import logout from "../controllers/logout.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import getCFProfile from "../controllers/getCFProfile.js";
import addProblem from "../controllers/addProblem.js";
import getProblemsByTask from "../controllers/getProblemByTask.js";
import createTask from "../controllers/createTask.js";
import getAllTasks from "../controllers/getAllTask.js";
import { updateTaskDeadline } from "../controllers/updateTaskDeadline.js";
import { removeProblemFromTask } from "../controllers/removeProblem.js";
import { deleteTask } from "../controllers/deleteTask.js";
const router = express.Router();

router.route("/requestVerification").post(requestVerification);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.get("/profile", isAuthenticated, getCFProfile);
router.post("/addProblem", isAuthenticated, addProblem);
router.get("/task/:taskId", isAuthenticated, getProblemsByTask);
router.post("/create", isAuthenticated, createTask);
router.get("/tasks", isAuthenticated, getAllTasks);
router.patch("/tasks/:taskId/deadline", updateTaskDeadline);
router.patch("/tasks/:taskId/remove-problem", removeProblemFromTask);
router.delete("/tasks/:taskId", deleteTask);

export default router;
