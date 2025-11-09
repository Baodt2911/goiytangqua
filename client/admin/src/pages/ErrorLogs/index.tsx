import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Alert,
  Card,
  Collapse,
  Descriptions,
  List,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import type { CollapseProps } from "antd";
import { getLogsAysnc } from "../../features/error_logs/error_logs.service";

type LogRecord = Record<string, unknown>;

type LogListItem = {
  id: string;
  entry: LogRecord;
};

const LIMIT_OPTIONS = [50, 100, 200];

const PRIMARY_FIELDS = new Set([
  "timestamp",
  "level",
  "status",
  "code",
  "method",
  "path",
  "message",
  "stack",
  "requestID",
  "requestId",
]);

const formatTimestamp = (value?: unknown): string | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  const asDate = new Date(String(value));
  if (Number.isNaN(asDate.getTime())) {
    return String(value);
  }
  return asDate.toLocaleString();
};

const getLevelColor = (value?: unknown) => {
  if (!value) return undefined;
  const level = String(value).toLowerCase();
  if (level.includes("error")) return "red";
  if (level.includes("warn")) return "orange";
  if (level.includes("info")) return "blue";
  if (level.includes("debug")) return "geekblue";
  return undefined;
};

const getStatusColor = (value?: unknown) => {
  const status = Number(value);
  if (Number.isNaN(status)) return undefined;
  if (status >= 500) return "red";
  if (status >= 400) return "volcano";
  if (status >= 300) return "purple";
  if (status >= 200) return "green";
  return undefined;
};

const getMethodColor = (value?: unknown) => {
  if (!value) return undefined;
  const method = String(value).toUpperCase();
  switch (method) {
    case "GET":
      return "geekblue";
    case "POST":
      return "green";
    case "PUT":
    case "PATCH":
      return "gold";
    case "DELETE":
      return "red";
    default:
      return "blue";
  }
};

const formatLabel = (label: string) =>
  label
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const renderValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined) {
    return <Typography.Text type="secondary">N/A</Typography.Text>;
  }

  if (typeof value === "string") {
    const shouldUsePre = value.includes("\n") || value.length > 120;
    if (shouldUsePre) {
      return (
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {value}
        </pre>
      );
    }
    return <Typography.Text>{value}</Typography.Text>;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <Typography.Text>{String(value)}</Typography.Text>;
  }

  try {
    return (
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  } catch {
    return <Typography.Text>{String(value)}</Typography.Text>;
  }
};

const ErrorLogs = () => {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [limit, setLimit] = useState<number>(LIMIT_OPTIONS[1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleFetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLogsAysnc({ limit });
      setLogs(Array.isArray(data) ? data : []);
      setError(undefined);
    } catch (err: any) {
      setError(err?.message || "Không thể tải logs");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    handleFetchLogs();
    const interval = setInterval(handleFetchLogs, 5000);
    return () => clearInterval(interval);
  }, [handleFetchLogs]);

  const logItems = useMemo<LogListItem[]>(
    () =>
      (logs || []).map((entry, index) => ({
        entry,
        id: String(
          entry.requestID ??
            entry.requestId ??
            entry.id ??
            entry._id ??
            `${entry.timestamp ?? "log"}-${index}`
        ),
      })),
    [logs]
  );

  return (
    <Card title="Error Logs" bordered={false}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space size="middle" wrap>
          <Typography.Text strong>Hiển thị</Typography.Text>
          <Select<number>
            value={limit}
            style={{ width: 120 }}
            onChange={(value) => setLimit(value)}
            options={LIMIT_OPTIONS.map((value) => ({
              value,
              label: `${value} dòng`,
            }))}
          />
        </Space>

        {error && (
          <Alert
            type="error"
            message="Đã xảy ra lỗi"
            description={error}
            showIcon
          />
        )}

        <List
          loading={loading}
          dataSource={logItems}
          rowKey={(item) => item.id}
          itemLayout="vertical"
          locale={{ emptyText: "Không có log nào" }}
          style={{ maxHeight: "70vh", overflow: "auto" }}
          renderItem={({ entry, id }) => {
            const timestamp = formatTimestamp(entry.timestamp);
            const level =
              typeof entry.level === "string"
                ? entry.level
                : typeof entry.type === "string"
                ? entry.type
                : undefined;
            const status =
              typeof entry.status === "number" ||
              typeof entry.status === "string"
                ? entry.status
                : undefined;
            const method =
              typeof entry.method === "string" ? entry.method : undefined;
            const path =
              typeof entry.path === "string" ? entry.path : undefined;
            const code =
              typeof entry.code === "number" || typeof entry.code === "string"
                ? entry.code
                : undefined;
            const requestId =
              typeof entry.requestID === "string"
                ? entry.requestID
                : typeof entry.requestId === "string"
                ? entry.requestId
                : undefined;

            const errorInfo =
              entry.error && typeof entry.error === "object"
                ? (entry.error as Record<string, unknown>)
                : null;

            const message =
              typeof entry.message === "string"
                ? entry.message
                : typeof errorInfo?.message === "string"
                ? errorInfo.message
                : undefined;

            const stack =
              typeof entry.stack === "string"
                ? entry.stack
                : typeof errorInfo?.stack === "string"
                ? errorInfo.stack
                : undefined;

            const detailEntries = Object.entries(entry).filter(
              ([key]) => !PRIMARY_FIELDS.has(key)
            );

            const collapseItems: CollapseProps["items"] = [];
            if (stack || detailEntries.length) {
              collapseItems.push({
                key: `${id}-details`,
                label: "Chi tiết",
                children: (
                  <Descriptions
                    column={1}
                    size="small"
                    bordered
                    colon
                    styles={{ label: { width: 100 } }}
                  >
                    {stack && (
                      <Descriptions.Item label="Stack" key="stack">
                        {renderValue(stack)}
                      </Descriptions.Item>
                    )}
                    {detailEntries.map(([key, value]) => (
                      <Descriptions.Item label={formatLabel(key)} key={key}>
                        {renderValue(value)}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                ),
              });
            }

            return (
              <List.Item
                style={{
                  borderRadius: 8,
                  border: "1px solid #f0f0f0",
                  padding: 16,
                  background: "#fff",
                }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Space size={[12, 8]} wrap align="center">
                    {timestamp && (
                      <Typography.Text strong>{timestamp}</Typography.Text>
                    )}
                    {level && (
                      <Tag color={getLevelColor(level)}>
                        {String(level).toUpperCase()}
                      </Tag>
                    )}
                    {status !== undefined && (
                      <Tag color={getStatusColor(status)}>{String(status)}</Tag>
                    )}
                    {code !== undefined && (
                      <Tag color="magenta">{String(code)}</Tag>
                    )}
                    {method && (
                      <Tag color={getMethodColor(method)}>
                        {String(method).toUpperCase()}
                      </Tag>
                    )}
                    {path && (
                      <Typography.Text type="secondary">
                        {String(path)}
                      </Typography.Text>
                    )}
                    {requestId && (
                      <Typography.Text code copyable>
                        {String(requestId)}
                      </Typography.Text>
                    )}
                  </Space>

                  {message && (
                    <Typography.Text
                      type="danger"
                      style={{ display: "block" }}
                      copyable={message ? { text: message } : undefined}
                    >
                      {message}
                    </Typography.Text>
                  )}

                  {collapseItems.length > 0 && (
                    <Collapse size="small" items={collapseItems} />
                  )}
                </Space>
              </List.Item>
            );
          }}
        />
      </Space>
    </Card>
  );
};

export default ErrorLogs;
