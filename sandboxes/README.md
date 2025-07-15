# CV2WEB Sandbox Environment

This directory contains isolated sandbox environments for portfolio generation. All code generation happens here in isolation before being approved and exported to the final destination.

## Structure

```
sandboxes/
├── portfolios/         # Individual portfolio sandboxes
│   └── {job-id}/      # Unique sandbox per generation job
│       ├── src/       # Generated portfolio code
│       ├── package.json
│       └── preview.url
└── README.md          # This file
```

## Security Benefits

1. **Isolation**: Generated code is isolated from the main codebase
2. **Preview**: Users can preview portfolios before deployment
3. **Cleanup**: Easy to remove failed or abandoned generations
4. **No Pollution**: Main codebase remains clean
5. **Audit Trail**: Each sandbox has a unique job ID for tracking

## Usage

Sandboxes are automatically created by the portfolio generation system. Do not manually create or modify sandbox contents unless debugging.