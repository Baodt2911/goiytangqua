import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getLogsController = (
  req: Request<{}, {}, {}, { limit?: string }>,
  res: Response
) => {
  const limit = Number(req.query.limit) || 100;

  const logDir = path.join(process.cwd(), "logs");
  const files = fs.readdirSync(logDir).filter((f) => f.startsWith("error-"));

  // Lấy file log mới nhất
  const latestFile = files.sort().reverse()[0];
  const filepath = path.join(logDir, latestFile);

  const lines = fs
    .readFileSync(filepath, "utf8")
    .trim()
    .split("\n")
    .reverse() // Lấy log mới nhất trước
    .slice(0, limit)
    .map((l) => JSON.parse(l));

  res.json(lines);
};
