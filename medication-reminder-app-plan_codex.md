# Medication Reminder App - Implementation Plan

Last updated: August 22, 2026

This plan reflects the local-first MVP that has been built and verified in Expo Go on iPhone, plus the next phases we should tackle after the core reminder loop is stable.

## 1. Product Goal

Build a medication reminder app for elderly users that:
- lets users add medication schedules manually
- reminds them at the appointed time
- escalates if nobody responds
- logs Taken, Snoozed, and Missed states
- stores data locally in SQLite so it survives app restarts

## 2. Current MVP Status

Completed today:
- Expo React Native app scaffold
- TypeScript setup
- Navigation shell with a single home flow
- SQLite persistence layer
- Manual add/edit medication screens
- Time picker for appointment-based reminders
- Day-of-week picker
- Recurring reminder scheduling
- Separate missed-dose escalation scheduling
- Snooze follow-up scheduling
- Taken action that clears the follow-up/safety path
- Home screen status indicator for Pending, Taken, Snoozed, and Missed
- Permission handling for notifications
- Basic visual polish for the elderly home screen
- Expo Go verification on iPhone

## 3. Current Architecture

### Platform and stack
- React Native with Expo
- TypeScript
- `expo-sqlite` for local data
- `expo-notifications` for local reminders
- `date-fns` for date/time helpers
- `@react-navigation/native` and native stack navigation

### App structure
- `App.tsx` initializes notifications and the database
- `src/navigation/RootNavigator.tsx` defines the main stack
- `src/screens/` contains the home, add, and edit screens
- `src/components/` contains reusable schedule and card UI
- `src/db/` contains SQLite schema and query helpers
- `src/services/` contains notification scheduling logic
- `src/types/` contains shared app types
- `src/theme/` contains colors and spacing

## 4. MVP Behavior That Exists Now

### Home screen
- Shows all medications in a simple list
- Displays schedule summary
- Displays current intake state:
  - Pending
  - Taken
  - Snoozed
  - Missed
- Large action buttons:
  - Taken
  - Snooze 15m
  - Edit

### Add/Edit medication
- Manual medication entry only
- Fields:
  - name
  - dosage
  - notes
  - reminder time
  - days of week
  - times per day
- Validation:
  - name required
  - dosage required
  - times per day must be 1-12
  - at least one day selected

### Reminder logic
- Recurring reminders are scheduled for selected days and clock time
- Missed-dose escalation exists as a separate safety path
- Snooze creates a temporary follow-up reminder
- Taken clears the safety path and follow-up reminder
- SQLite stores all data locally

## 5. Database Model

### Tables
- `medications`
- `schedules`
- `adherence_events`

### Schedule fields
- `timesPerDay`
- `daysOfWeek`
- `reminderTime`
- `notificationId`
- `followUpNotificationId`
- `missedDoseNotificationId`
- `reminderMinutes`

### Event fields
- `medicationId`
- `timestamp`
- `status`

## 6. Build Order Completed

1. Expo app scaffold and TypeScript
2. Notification permissions and handler setup
3. SQLite schema and query helpers
4. Medication add/edit screens
5. Schedule time picker and day picker
6. Recurring reminders
7. Snooze behavior
8. Missed-dose escalation safety path
9. Home screen intake state indicator
10. Compile checks and Expo Go validation on iPhone

## 7. Next Immediate Work

These are the next useful improvements after the current MVP:

1. Make reminder state more visible
   - Add a small permission status banner
   - Show when notification permission is missing or denied
   - Show when a medication has an active missed-dose escalation scheduled

2. Improve schedule clarity
   - Show the next upcoming reminder time in the card
   - Show selected days more prominently
   - Make recurrence wording more human-friendly

3. Strengthen safety flows
   - Add explicit empty-state guidance for Missed doses
   - Add a visual treatment for Missed that is harder to overlook
   - Consider a future caregiver alert path for missed doses

4. Improve testability
   - Add a lightweight debug screen for notification IDs and schedule state
   - Add a local reset button for clearing demo data
   - Add a seed action for a 1-2 minute test medication

## 8. Future Enhancements

### Caregiver features
- Separate caregiver mode
- Linked caregiver and elderly accounts
- Shared medication list
- Caregiver dashboard
- Missed-dose alerts for caregivers
- Remote editing of medication schedules

### Adherence tracking
- History screen
- Calendar or list-based adherence log
- Percent adherence stats
- Trend view over time

### Accessibility
- Adjustable font size
- High-contrast mode
- Voice reminders
- Larger tap targets across all screens
- Simplified reminder copy for older adults

### Medication management
- Photo support for each medication
- More advanced schedule rules
- Multiple times per day with distinct clock times
- Pause/resume with clearer schedule status

### Notification enhancements
- Better retry/escalation rules
- Caregiver escalation after repeated missed doses
- Notification grouping
- Rich notification content

### Data and sync
- Firebase auth
- Firebase sync
- Multi-device caregiver/elderly sharing
- Cloud backup and restore

### Testing and release
- Automated unit tests for scheduling logic
- Device-level notification tests
- Integration tests for Taken/Snooze/Missed
- App Store / Play Store release preparation

## 9. Recommended Future Build Sequence

1. Add permission/debug status UI
2. Add next reminder preview on the home screen
3. Add stronger missed-dose visual treatment
4. Add adherence history
5. Add caregiver mode
6. Add cloud sync
7. Add accessibility settings and voice reminders
8. Add automated tests and release hardening

## 10. Notes

- The current app is intentionally local-first.
- Notification behavior has been verified in Expo Go on iPhone.
- The missed-dose path is treated as a safety feature, not a nice-to-have.
- The current implementation can be extended without changing the basic local data model.
