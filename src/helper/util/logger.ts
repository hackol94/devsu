import winston, { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Create a Winston logger instance for a specific scenario
 * 
 * Creates a logger that writes to both file and console with structured formatting.
 * Each scenario gets its own log file in a dedicated directory.
 * 
 * @param scenarioName - Name of the scenario for log file naming
 * @param scenarioId - Unique ID of the scenario
 * @returns Configured Winston Logger instance
 * 
 * Requirements: 6.1-6.6, 64.1-64.5
 */
export function createLogger(scenarioName: string, scenarioId: string): Logger {
  // Sanitize scenario name for file system
  const sanitizedName = scenarioName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  
  // Create log directory
  const logDir = path.join('target', 'site', 'cypress', 'logs', sanitizedName);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Create logger instance
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss'
      }),
      winston.format.printf(info => {
        return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
      })
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(logDir, 'log.log'),
        options: { flags: 'w' } as any // Overwrite file
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
  
  logger.info(`Logger initialized for scenario: ${scenarioName} (${scenarioId})`);
  
  return logger;
}
