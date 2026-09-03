// In-memory state for Commit 1 (no localStorage, no persistence)
let habits = [];

// DOM Elements
const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-input");
const habitList = document.getElementById("habit-list");
const emptyState = document.getElementById("empty-state");

/**
 * Renders the habit list or empty state based on in-memory habits.
 */
function renderHabits() {
  habitList.innerHTML = "";

  if (habits.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  habits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = `habit-item${habit.completed ? " completed" : ""}`;

    const nameSpan = document.createElement("span");
    nameSpan.className = "habit-name";
    nameSpan.textContent = habit.name;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "habit-actions";

    const checkBtn = document.createElement("button");
    checkBtn.type = "button";
    checkBtn.className = `check-btn${habit.completed ? " completed-btn" : ""}`;
    checkBtn.textContent = habit.completed ? "Done ✓" : "Check Off";
    checkBtn.disabled = habit.completed;

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

    li.appendChild(nameSpan);
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
    completed: false
  };

  habits.push(newHabit);
  renderHabits();
}

/**
 * Marks a habit as checked off for the current session.
 * Prevents repeated completions on already completed habits.
 */
function checkOffHabit(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit || habit.completed) {
    return;
  }

  habit.completed = true;
  renderHabits();
}

/**
 * Deletes a habit from state and updates the view.
 */
function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
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
