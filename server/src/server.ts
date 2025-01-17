import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { configPassport, configSocket, connectMongoDb } from "./configs";
import {
  commentRouter,
  filterRouter,
  notificationRouter,
  otpRouter,
  postRouter,
  productRouter,
  refreshTokenRouter,
  relationshipRouter,
  userRouter,
} from "./routes";
import passport from "passport";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;

configSocket(io);
configPassport();
app.use(
  session({
    secret: process.env.SESSION_KEY || "12222",
    resave: false, // Không lưu lại session nếu không thay đổi
    saveUninitialized: false, // Lưu session mới ngay cả khi chưa khởi tạo
    cookie: {
      httpOnly: true, // Bảo vệ cookie khỏi bị truy cập bởi JavaScript
      secure: false, // Đặt true nếu dùng HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Cookie tồn tại trong 1 ngày
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: "sessions",
      collectionName: "google",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.URL_CLIENT, // Domain của client
    methods: ["GET", "POST"],
    credentials: true, // Cho phép cookies hoặc HTTP authentication
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});
app.use("/auth", userRouter);
app.use("/comment", commentRouter);
app.use("/product", productRouter);
app.use("/token", refreshTokenRouter);
app.use("/post", postRouter);
app.use("/notification", notificationRouter);
app.use("/filter", filterRouter);
app.use("/otp", otpRouter);
app.use("/relationship", relationshipRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: ReasonPhrases.NOT_FOUND,
  });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    status,
    message,
  });
});
const startServer = async () => {
  try {
    await connectMongoDb();
    server.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
    process.exit(1);
  }
};
startServer();
