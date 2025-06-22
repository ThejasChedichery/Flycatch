

import express from "express";
import { EditUserPreferance, RegisterUser } from "../Controller/UserController";

const Router = express.Router();

Router.post('/Register', RegisterUser);
Router.patch('/editPreferance/:id', EditUserPreferance)

export default Router;