# Iglesia Bautista Getsemani - Donation Tracker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Hardcoded admin login with username and password (admin / getsemani2024)
- Member management: add, edit, delete members (name)
- Donation recording: add donations per member (date + amount)
- Monthly donation totals per member
- Printable individual receipt for each member (for tax purposes)
- Printable church-wide summary report by month or year
- Branding for Iglesia Bautista Getsemani
- All UI in Spanish

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: members CRUD, donations CRUD, query by member/date range
2. Frontend: login page with username/password, members page, donations page, reports/receipts page
3. Auth: simple session-based check — username 'admin', password 'getsemani2024', stored in localStorage on success
