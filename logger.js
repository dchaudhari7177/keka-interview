// LOGGER (setup only, you don't need to change this file)
// Prints lines like:  2026-11-26 11:40:00 info: Created item {"id":1}
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...extra }) => {
      const extraText = Object.keys(extra).length ? ' ' + JSON.stringify(extra) : '';
      return `${timestamp} ${level}: ${message}${extraText}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
