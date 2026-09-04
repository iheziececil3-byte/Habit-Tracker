# Habit Tracker

A simple single-page web app for tracking daily habits and building consistency through streaks.

I built this project as part of my Ship and Found weekly Ship Log work. The goal was not to build a complicated productivity system, but to take a small idea and build it properly in stages — starting with the core functionality, then adding persistence and streak calculation, and finally handling validation, responsiveness, and edge cases.

## What the App Does

Habit Tracker allows you to:

* Add a habit you want to track.
* See all your saved habits.
* Check off a habit once for the current calendar day.
* See the current streak for each habit.
* Delete a habit and its saved history.
* Keep your habits and completion history after refreshing the browser.

For example, you could add:

* Drink Water
* Read 10 Pages
* Exercise

Each habit keeps track of the dates it was completed and uses those dates to calculate the current streak.

## How the Streak Works

The streak is calculated from the habit's actual completion dates rather than storing a separate streak number.

The rules are:

* If the habit was completed today, the streak counts backward from today.
* If it has not been completed today but was completed yesterday, the streak counts backward from yesterday.
* A missing day breaks the streak.
* Future dates do not count.
* If there is no completion for today or yesterday, the streak is `0`.
* A habit can only be checked off once per calendar day.

This means the completion dates are the source of truth. The displayed streak is calculated from them whenever the app renders.

The app uses the user's local calendar date rather than treating a streak as a rolling 24-hour period.

## Tech Used

This project intentionally uses basic web technologies:

* HTML
* CSS
* JavaScript
* Browser `localStorage`

No framework or external dependency was used.

The project is made up of three main application files:

```text
index.html
script.js
style.css
```

The documentation files are:

```text
README.md
journal.md
```

## Data Persistence

The app stores habit data in the browser's `localStorage` using the key:

```text
habit_tracker_habits
```

Each saved habit contains:

```text
{
  id,
  name,
  completionDates
}
```

The app does not store a value such as `streak: 7`.

Instead, the streak is derived from `completionDates`. This keeps the completion history as the source of truth and prevents the stored streak value from becoming inconsistent with the actual dates.

Because the app uses browser `localStorage`, the data is stored locally in the browser. It is not connected to a backend or database.

## Project Development

I built the project in four commits.

### Commit 1 — Core Habit Functionality

**Commit:** `a92b801`
**Message:** `Build core habit tracker functionality`

The first version focused only on the basic interaction:

* Adding habits.
* Displaying habits.
* Checking off a habit.
* Removing habits.
* Showing the empty state.

At this stage, the app did not use `localStorage` and did not calculate streaks. The purpose was to get the basic habit workflow working before adding more complexity.

### Commit 2 — Persistence and Streak Calculation

**Commit:** `3dfdb02`
**Message:** `Add persistence and streak calculation`

The second stage introduced the main data logic:

* Browser `localStorage`.
* Completion dates.
* Restoration after refresh.
* One completion per calendar day.
* Derived streak calculation.
* Displayed streak count.
* Clearing stored data when a habit is deleted.

The streak logic also had to account for gaps, incomplete current days, and future dates.

This was the point where the project became more than a simple session-based checklist.

### Commit 3 — Validation and Responsive Layout

**Commit:** `385c59a`
**Message:** `Polish validation and responsive layout`

The third stage focused on making the existing functionality safer and easier to use without rebuilding the persistence and streak logic.

Changes included:

* Preventing empty habit names.
* Preventing whitespace-only habit names.
* Preventing duplicate habit names regardless of capitalization.
* Showing inline validation messages.
* Clearing validation errors when the user starts typing again.
* Adding accessibility attributes to the habit input and error message.
* Improving the layout for narrow screens.
* Checking that the existing persistence, streak, deletion, and check-in behaviour still worked after the changes.

The responsive layout was tested at a narrow viewport of 320px to make sure the interface remained usable without horizontal scrolling.

## Testing

Testing was an important part of the project rather than something left until the end.

For Commit 2, I manually tested the persistence and streak rules, including:

* Saving and restoring habits.
* Saving completion dates.
* Preventing duplicate same-day check-ins.
* Consecutive-day streaks.
* Streaks broken by gaps.
* Incomplete current days.
* Future completion dates.
* Deleting stored habits.
* Re-adding a deleted habit with fresh history.

For Commit 3, I completed **34 manual and read-only verification checks** covering:

* Empty and whitespace-only input.
* Duplicate detection.
* Case-insensitive duplicate detection.
* Error message behaviour.
* Successful habit creation.
* Responsive behaviour at 320px.
* Horizontal overflow.
* Button usability.
* Same-day check-in protection.
* Persistence after refresh.
* Consecutive streaks.
* Streak gaps.
* Future dates.
* Deletion and re-adding habits.
* Empty-state behaviour.
* Stored data structure.
* Absence of a raw stored streak value.
* Project scope.
* Dependencies.
* Documentation scope.
* Git commit state.
* Push state.

All 34 Commit 3 checks passed before the commit was created and pushed.

## GitHub Workflow

I used Git throughout the project so that each major stage of the application had its own commit.

The final Git history is:

```text
385c59a Polish validation and responsive layout
3dfdb02 Add persistence and streak calculation
a92b801 Build core habit tracker functionality
```

The commits were created manually and pushed to the `master` branch.

## Current Scope

This version is intentionally small.

It does not include:

* User accounts.
* A backend.
* Cloud synchronization.
* Multiple users.
* Notifications.
* A calendar interface.
* Weekly or monthly analytics.
* Undo functionality.
* Editing existing habit names.

The check-in action is also intentionally one-way for this version. Once a habit is marked complete for the current day, there is no undo button.

These limitations are intentional because the goal of this project was to build and understand a small working product rather than keep adding features.

## What I Learned

The biggest lesson from this project was that even a small app can become complicated once it has to remember state over time.

The first version was straightforward because everything existed only in the current session. Adding persistence changed the problem. I had to think about how completion dates should be stored, how a streak should be calculated, what happens when a day is missed, and how the app behaves after a refresh.

I also learned the importance of treating stored data as the source of truth instead of storing values that can be derived from that data.

Another important part of the project was testing. Some behaviours, especially historical streak cases, could not be tested just by clicking around the normal interface. I had to inspect and modify the stored data in the browser to verify cases such as gaps and future dates.

Most importantly, I learned to build in stages and protect working functionality while adding new features. Each commit had a clear purpose, and I verified the previous functionality before moving forward.

## Running the Project

Because this is a simple frontend application, it can be opened directly in a browser.

Open:

```text
index.html
```

in a modern web browser.

The application does not require a server, backend, database, package installation, or build process.

## Project Structure

```text
Habit Tracker App/
├── index.html
├── script.js
├── style.css
├── README.md
└── journal.md
```

`README.md` explains the finished project.

`journal.md` records the actual development process, decisions, problems, testing, Git workflow, and lessons learned while building it.
