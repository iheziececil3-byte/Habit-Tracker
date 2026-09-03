// LocalStorage key for Commit 2 persistence
const STORAGE_KEY = "habit_tracker_habits";

// DOM Elements
const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-input");
const habitList = document.getElementById("habit-list");
const emptyState = document.getElementById("empty-state");

/**
 * Returns a date formatted as YYYY-MM-DD in the user's local calendar time.
 * Uses local calendar methods to prevent UTC timezone shifts.
 */
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates current streak from an array of completion dates.
 * The streak is strictly derived and never stored as a raw number.
 *
 * Rules:
 * - If today is completed: count consecutive calendar days backward from today.
 * - If today is not completed but yesterday is: count backward from yesterday.
 * - If neither today nor yesterday is completed: streak is 0.
 * - Any missing calendar day breaks the streak.
 * - Future completion dates do not contribute to the streak.
 */
function calculateStreak(completionDates) {
  if (!Array.isArray(completionDates) || completionDates.length === 0) {
    return 0;
  }

  const todayStr = getLocalDateString();
  // Filter out any invalid dates or dates in the future
  const datesSet = new Set(
    completionDates.filter((d) => typeof d === "string" && d <= todayStr)
  );

  // Use noon to avoid any Daylight Saving Time shift during date subtraction
  const checkDate = new Date();
  checkDate.setHours(12, 0, 0, 0);

  const todayFormatted = getLocalDateString(checkDate);

  if (datesSet.has(todayFormatted)) {
    // Today is completed -> start backward count from today
  } else {
    // Check if yesterday was completed
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayFormatted = getLocalDateString(checkDate);
    if (datesSet.has(yesterdayFormatted)) {
      // Yesterday is completed -> start backward count from yesterday
    } else {
      // Neither today nor yesterday is completed
      return 0;
    }
  }

  let streak = 0;
  while (true) {
    const dateStr = getLocalDateString(checkDate);
    if (datesSet.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Loads habits from localStorage.
 */
function loadHabits() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          id: item.id || String(Date.now() + Math.random()),
          name: item.name || "",
          completionDates: Array.isArray(item.completionDates) ? item.completionDates : []
        }));
      }
    }
  } catch (error) {
    console.error("Failed to load habits from localStorage:", error);
  }
  return [];
}

/**
 * Persists habits and their completion dates to localStorage.
 * Does not store any raw or derived streak numbers.
 */
function saveHabits() {
  try {
    const dataToSave = habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      completionDates: habit.completionDates
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Failed to save habits to localStorage:", error);
  }
}

// In-memory habits initialized from localStorage
let habits = loadHabits();

/**
 * Renders the habit list or empty state based on current habits.
 */
function renderHabits() {
  habitList.innerHTML = "";

  if (habits.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  const today = getLocalDateString();

  habits.forEach((habit) => {
    const isCompletedToday = habit.completionDates.includes(today);
    const streak = calculateStreak(habit.completionDates);

    const li = document.createElement("li");
    li.className = `habit-item${isCompletedToday ? " completed" : ""}`;

    const mainDiv = document.createElement("div");
    mainDiv.className = "habit-main";

    const nameSpan = document.createElement("span");
    nameSpan.className = "habit-name";
    nameSpan.textContent = habit.name;

    const streakSpan = document.createElement("span");
    streakSpan.className = "habit-streak";
    streakSpan.textContent = `Streak: ${streak} ${streak === 1 ? "day" : "days"}`;

    mainDiv.appendChild(nameSpan);
    mainDiv.appendChild(streakSpan);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "habit-actions";

    const checkBtn = document.createElement("button");
    checkBtn.type = "button";
    checkBtn.className = `check-btn${isCompletedToday ? " completed-btn" : ""}`;
    checkBtn.textContent = isCompletedToday ? "Done ✓" : "Check Off";
    checkBtn.disabled = isCompletedToday;

    checkBtn.addEventListener("click", () => {
      checkOffHabit(habit.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      deleteHabit(habit.id);
    });

    actionsDiv.appendChild(checkBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(mainDiv);
    li.appendChild(actionsDiv);

    habitList.appendChild(li);
  });
}

/**
 * Handles adding a new habit.
 */
function addHabit(name) {
  const trimmedName = name.trim();

  // Reject empty or whitespace-only input
  if (!trimmedName) {
    return;
  }

  const newHabit = {
    id: String(Date.now() + Math.random()),
    name: trimmedName,
    completionDates: []
  };

  habits.push(newHabit);
  saveHabits();
  renderHabits();
}

/**
 * Marks a habit as checked off for today's calendar date.
 * Enforces one check-in per calendar day.
 */
function checkOffHabit(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) {
    return;
  }

  const today = getLocalDateString();
  // Prevent duplicate completion records for the same calendar date
  if (habit.completionDates.includes(today)) {
    return;
  }

  habit.completionDates.push(today);
  saveHabits();
  renderHabits();
}

/**
 * Deletes a habit and removes its stored completion dates.
 */
function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  saveHabits();
  renderHabits();
}

// Event Listeners
habitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = habitInput.value;
  addHabit(value);
  habitInput.value = "";
  habitInput.focus();
});

// Initial render
renderHabits();
