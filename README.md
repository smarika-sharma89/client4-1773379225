# Bill Approvals — Varicon Prototype

Generated from a Varicon discovery session.

## What this demonstrates
The prototype should focus on the highest-priority item confirmed in next steps: the three-phase bill approval visibility enhancement. It should display a bills list view with updated, granular approval status labels (e.g. 'Awaiting 1st Approval', 'Awaiting 2nd Approval', 'Awaiting Final Approval', 'Fully Approved') so users can immediately see where each bill sits in the workflow. The prototype should also include a working approval filter panel that correctly filters bills by the specific approver whose action is currently pending, resolving the broken multi-approver filter issue. A bill detail view should show an approval progress indicator (e.g. a step tracker or timeline) displaying which approvers have acted and who is next. If time permits, a secondary screen mocking up the Day Works docket notes/audit log feature should be included — showing an internal notes panel on a submitted docket that appends timestamped entries to an audit log visible to the team, without modifying the docket document itself.

## Features shown
- Additional granular approval statuses (e.g. 'Awaiting 2nd Approval', 'Awaiting Final Approval') to distinguish phases in the three-phase approval workflow
- Fix the approval filter so users can filter bills by the specific approver whose action is currently pending
- Ability to directly edit the GST figure on a bill so that subtotal and GST match the physical invoice without corrupting the subtotal
- Improved or more reliable bill sync mechanism with Xero that reduces manual intervention
- WBS copy/duplicate functionality so users can apply the same WBS assignment across all lines of a bill and amend exceptions
- Ability to add internal notes or audit log entries to submitted Day Works dockets without reopening them or affecting the docket itself
- Self-service interface for users to view, upload, and amend Day Works charge rates directly within Varicon
- In-app approval visibility/notification system as an alternative to high-volume email notifications
- Lost time tracking and reporting for stand-down hours (e.g. inclement weather)

## Running locally
```
npm install
npm run dev
```

## Note
This is a prototype with mock data. No real API calls are made.
