export const VALIDATION_CONSTANTS = {
  REGEX_PATTERNS: {
    TENANT_NAME: {
      PATTERN: /^[a-z0-9_]+$/,
      MESSAGE:
        'Tenant name can only contain lowercase letters, numbers, and underscores',
    },
  },
};
