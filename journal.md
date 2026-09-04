# Habit Tracker — Development Journal

## Why I Built This

For this week's Ship Log project, I decided to build a simple Habit Tracker.

The idea was straightforward: I wanted an app where I could add habits such as "Drink Water" or "Read 10 Pages", check them off once each day, and see how many consecutive days I had maintained each habit.

At first, the project looked very simple. However, I quickly realized that a streak tracker is slightly more complicated than an app like MoodQuote because the application needs to remember what happened on previous days.

That became an important part of the project. Instead of only making the interface work, I needed to think about how the data would be stored, how a streak should be calculated, and how the app should behave after refreshing the browser.

I decided to build the project incrementally using four commits so that each stage had a clear purpose.

---

# Commit 1 — Core Habit Functionality

**Commit:** `a92b801`
**Message:** `Build core habit tracker functionality`

The first goal was to build only the basic functionality.

I kept this stage intentionally simple. The app needed to allow me to:

* Add a habit
* Display the habit in the list
* Check off the habit for the current session
* Delete a habit
* Show an empty state when there were no habits

At this stage, I deliberately did **not** add localStorage or streak calculation.

This was important because I wanted Commit 1 to represent the basic working version before introducing persistence and date-based logic.

The application was built with plain HTML, CSS, and JavaScript. I did not use a framework or external dependency.

Once the core functionality was working, I manually staged the files through the IDE's Source Control interface and created the Git commit.

I then pushed the commit to GitHub.

The working tree was clean after the push, and the branch was correctly tracking the remote `master` branch.

### What I learned from Commit 1

The main lesson was that I did not need to build everything at once.

Breaking the project into smaller commits made it easier to understand what each stage was responsible for and made it easier to identify whether a later change had broken something that was already working.

---

# Commit 2 — Persistence and Streak Calculation

**Commit:** `3dfdb02`
**Message:** `Add persistence and streak calculation`

This was the biggest technical step of the project.

The main problem was that the first version forgot everything when the page was refreshed.

For a habit tracker, that obviously would not work. The app needed to remember the habits and their completion history.

## Choosing localStorage

I decided to use the browser's `localStorage`.

The stored data uses a structure similar to:

```text
{
  id,
  name,
  completionDates
}
```

The important decision here was to store the **completion dates** rather than storing a number such as `streak: 7`.

The completion dates became the source of truth.

That means the streak is calculated from the actual dates instead of being treated as permanent data.

This made the application more reliable because the streak can be recalculated whenever the application loads.

## Calendar Dates Instead of a Rolling 24 Hours

Another important decision was that the application should work with **calendar days**, not a rolling 24-hour period.

For example, completing a habit at 11:50 PM and then completing it again shortly after midnight counts as two different calendar days.

The application therefore generates a local date in the format:

```text
YYYY-MM-DD
```

The date is based on the user's local calendar rather than UTC.

## How I Defined a Streak

I had to establish exactly what a streak means before implementing the calculation.

The rule I used was:

* If the habit was completed today, start counting from today.
* If it was not completed today but was completed yesterday, start counting from yesterday.
* Continue backwards while every previous calendar day is present.
* If there is a gap, stop counting.
* Future dates do not contribute to the streak.
* If there is no completion for today or yesterday, the streak is `0`.

This meant that a streak is a value **derived from the completion history** rather than something stored directly.

## One Check-In Per Day

I also decided that a habit could only be checked off once per calendar day.

After checking a habit, the button changes to:

```text
Done ✓
```

and becomes disabled.

The same date is not added to `completionDates` a second time.

I also kept the check-in action one-way for this version. There is no undo button.

## Deleting a Habit

When a habit is deleted, its stored record is also removed.

If I add the same habit again later, it starts with an empty completion history and a streak of `0`.

This keeps the newly created habit separate from the deleted one.

---

# Testing Commit 2

This stage taught me an important lesson about testing.

The coding agent initially reported that its tests were passing, but some of those tests were simulated runtime tests rather than actual browser testing.

I did not want to assume that the application worked just because the agent reported success.

So I manually tested the application in the browser.

I tested normal functionality, persistence after refresh, completed-state restoration, prevention of duplicate same-day check-ins, streak calculation, deletion, re-adding habits, and the stored data structure.

Some of the streak cases required dates that I could not naturally create through the interface.

For example, I needed to test:

* Consecutive dates
* A gap between dates
* A future date
* Yesterday being complete while today was incomplete
* No completion for today or yesterday

To test these properly, I used the browser's DevTools console to modify the stored completion dates.

This was also where I encountered the browser's warning about pasting code into DevTools. I followed the browser instruction and typed:

```text
allow pasting
```

After that, I was able to perform the required tests.

The results confirmed that the streak calculation behaved as intended.

For example:

```text
2026-09-03
2026-09-02
2026-08-31
```

produced a two-day streak because the gap between September 2 and August 31 broke the streak.

I also tested future dates and confirmed that they did not increase the streak.

## Code Quality Check

Before committing, I also reviewed the Git diff.

`git diff --check` found one trailing whitespace issue in `script.js`.

I fixed only that whitespace issue rather than making unrelated changes.

The remaining LF/CRLF warnings were normal Windows line-ending warnings and were not code errors.

After the final checks, I manually staged the files and created the commit.

I then pushed Commit 2 to GitHub.

---

# Commit 3 — Final Polish and Edge Cases

**Commit:** `385c59a`
**Message:** `Polish validation and responsive layout`

Once persistence and streak calculation were working, I wanted the third commit to improve the user experience without rebuilding the application.

I specifically wanted to avoid introducing unnecessary features.

The main improvements were:

* Habit name validation
* Duplicate habit prevention
* Inline error messages
* Responsive layout
* Small accessibility improvements

## Preventing Empty Habit Names

The application now prevents an empty habit from being created.

It also prevents whitespace-only input.

The exact error message is:

```text
Please enter a habit name.
```

## Preventing Duplicate Habits

I decided that the same habit should not be added more than once.

The duplicate check ignores leading/trailing spaces and capitalization.

For example:

```text
Read 10 pages
read 10 pages
READ 10 PAGES
```

are treated as the same habit.

The exact error message is:

```text
A habit with this name already exists.
```

Importantly, trying to create a duplicate does not modify the existing habit or its completion history.

## Error Feedback

Instead of using browser alerts, I added an inline error message below the form.

The error is cleared when I start typing again or when a habit is successfully created.

This made the feedback more natural and less disruptive.

I also added accessibility attributes such as an accessible label for the input and live error feedback.

## Responsive Layout

I also wanted the application to work properly on smaller screens.

I added a small responsive CSS section rather than redesigning the entire interface.

The mobile layout was manually tested at approximately **320px wide**.

I checked that:

* There was no horizontal scrolling.
* Habit names remained readable.
* Streak information did not collide with the habit name.
* Buttons remained usable.
* The overall card structure still looked like the same application.

---

# Testing Commit 3

For this stage, I performed a much more extensive manual verification.

I tested empty input, whitespace-only input, normal habit creation, duplicate names with different capitalization, error clearing, successful creation, responsive behavior, check-ins, streak calculations, deletion, re-adding deleted habits, the empty state, persistence, and the stored data structure.

I also checked that the project had not accidentally grown beyond its intended scope.

The final verification covered **34 checks**, and all of them passed.

Some of the important checks included:

* Empty submission showed the correct error.
* Whitespace-only submission showed the correct error.
* Duplicate names were rejected.
* Duplicate names with different capitalization were rejected.
* Existing habits were not changed by duplicate attempts.
* Errors cleared when typing.
* New habits were created successfully.
* The application worked at 320px wide.
* There was no horizontal overflow.
* A check-in produced a one-day streak.
* A second check-in on the same day did nothing.
* Completed state survived a refresh.
* Consecutive dates produced the expected streak.
* Gaps correctly broke the streak.
* Future dates were ignored.
* Deleting a habit removed it from storage.
* Re-adding a deleted habit started with a fresh history.
* The empty state still worked.
* Stored data contained completion dates rather than a raw streak value.
* No additional files or dependencies had been introduced.
* No Git commit or push had been performed by the agent.

The final audit confirmed that the project was ready to commit.

I then manually staged the three application files and created Commit 3.

After checking the status, the working tree was clean and the branch was one commit ahead of GitHub.

I pushed the commit manually.

The push completed successfully:

```text
3dfdb02..385c59a master -> master
```

At this point, all three implementation commits were on GitHub.

---

# Commit 4 — Documentation

Commit 4 is different from the previous three commits.

There is no new application feature to build.

The purpose of this commit is to document the project and the actual development process.

I created:

```text
README.md
journal.md
```

I am writing these documents based on what actually happened during development instead of creating generic documentation.

The README explains the project, its functionality, technical decisions, testing, Git workflow, and current scope.

The journal records the development process in chronological order, including decisions, testing, difficulties, debugging, and lessons learned.

One small issue happened while creating the documentation files: I initially created the wrong file/folder structure while trying to create `README.md` and `journal.md`.

I noticed the mistake, deleted the incorrect structure, and recreated the files properly as two separate Markdown files in the project root.

---

# Problems and Difficulties I Encountered

The project was relatively small, but there were still a few things that required attention.

## 1. Agent Tests vs Real Browser Tests

One of the biggest lessons was that an agent reporting that tests passed is not automatically the same thing as manually verifying the application in the browser.

Some of the agent's tests were simulated rather than actual browser interaction.

I therefore treated the agent's report as useful evidence but still performed the important tests myself.

## 2. Testing Historical Dates

The streak calculation depends on dates, but the application's interface only allows me to check off today's date.

That meant I needed another way to test historical scenarios.

I used DevTools and modified the stored completion dates so I could test gaps, consecutive days, and future dates.

This gave me much more confidence that the streak calculation was actually following the rules I had defined.

## 3. Code Quality Check

`git diff --check` found a trailing whitespace issue in `script.js`.

I fixed the specific issue and ran the check again.

This reinforced the importance of checking the actual Git diff before committing instead of assuming the code is ready.

## 4. Windows Line Ending Warnings

Git displayed LF/CRLF warnings during some of the Git operations.

At first these looked like potential problems, but they were normal Windows line-ending behavior and did not indicate a functional problem with the application.

## 5. Keeping the Scope Under Control

There was always a temptation to add more features.

I deliberately kept the project focused on the original goal instead of turning it into a much larger application.

That helped keep the four-commit structure meaningful.

---

# What I Learned

This project taught me more than just how to make a habit tracker.

The biggest lesson was the importance of **building incrementally**.

Instead of asking an agent to build the entire application in one step, I separated the work into clear stages.

I also learned that a data model matters even in a small application.

Using completion dates as the source of truth was a better design than simply storing a streak number.

I learned that testing needs to include edge cases, especially when dates are involved.

I also learned to distinguish between:

* Code that looks correct
* Tests that simulate behavior
* Actual behavior in the browser

Those are not always the same thing.

Another important lesson was Git discipline.

I kept the commits separate, reviewed the changes before committing, manually handled staging and pushing, and made sure the Git history represented meaningful stages of the project.

Most importantly, I learned that keeping a project small does not mean skipping proper engineering decisions.

Even this simple application required decisions about persistence, data structure, dates, validation, accessibility, responsive design, testing, and version control.

---

# Final State

The Habit Tracker is now a working vanilla HTML/CSS/JavaScript application with:

* Habit creation
* Habit deletion
* Daily check-ins
* Persistent browser storage
* Calendar-based streak calculation
* Duplicate-name prevention
* Input validation
* Inline error feedback
* Responsive layout
* Basic accessibility improvements
* Empty-state handling

The implementation commits have been pushed to GitHub.

The remaining work for the fourth commit is to finish and commit the project documentation.

The final project structure is:

```text
Habit Tracker App/
├── index.html
├── script.js
├── style.css
├── README.md
└── journal.md
```

This project started as a simple idea for a weekly Ship Log, but building it step by step gave me a better understanding of how small product decisions, data modeling, testing, and Git workflow come together to produce a working application.
