const VALID_STACKS = new Set(['backend', 'frontend']);
const VALID_LEVELS = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const VALID_PACKAGES = new Set([
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'
]);

const validateLogInputs = (stack, level, pkg, message) => {
  if (!VALID_STACKS.has(stack)) return `Invalid stack: ${stack}`;
  if (!VALID_LEVELS.has(level)) return `Invalid level: ${level}`;
  if (stack === 'backend' && !VALID_PACKAGES.has(pkg)) return `Invalid package: ${pkg}`;
  if (!message || typeof message !== 'string') return 'Invalid message';
  
  return null; // No errors
};

module.exports = { validateLogInputs };
