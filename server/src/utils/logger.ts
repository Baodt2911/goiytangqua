import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      dirname: "logs",
      filename: "error-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxSize: "10m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;
