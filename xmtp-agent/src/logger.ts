import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format with colors for console
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = JSON.stringify(meta, null, 2);
    }
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr ? '\n' + metaStr : ''}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console output with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // File output - all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'xmtp-agent.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // File output - errors only
    new winston.transports.File({
      filename: path.join(logsDir, 'xmtp-agent-errors.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

export default logger;
