# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-05-02
### Added
- Native `JSONStore` utility for local persistence bypassing MongoDB.
- Custom Logging Middleware featuring 5MB log file auto-rotation.
- Vehicle Scheduler Domain with full REST API and programmatic collision detection.
- Notification Domain with Async Worker simulating Queue processing, featuring a 3-retry exponential backoff mechanism.
- Realistic demographic seeder script (`npm run seed`).
- Global `responseTime` and centralized `errorHandler` middlewares.

### Changed
- Refactored all endpoints for strict Clean MVC Architecture.
- Upgraded System Design Markdown documentation.

### Security
- Purged all hardcoded DB/SMTP credentials from `.env` and `.env.example`.
- Implemented strict route-level validations using explicit destructuring.
