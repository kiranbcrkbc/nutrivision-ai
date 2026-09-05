# NutriVision AI – Test Suites

This directory contains multi-service integration and end-to-end (E2E) automated verification suites.

## Folder Organization:
- `integration/`: Tests verifying communication between Spring Boot Backend and FastAPI AI Service, database transactional integrity, and PDF generator outputs.
- `e2e/`: Automated flows simulating complete user journeys: Registration $\to$ Assessment Session $\to$ Image Quality Check $\to$ Prediction $\to$ Diet Plan $\to$ Report Download.
