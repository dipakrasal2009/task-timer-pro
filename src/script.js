document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompleted = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskDuration = document.getElementById('taskDuration');
    const taskComplete = document.getElementById('taskComplete');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // New global variables
    let pomodoroTimer;
    let pomodoroTime = 25 * 60; // 25 minutes
    const totalTimeSpan = document.getElementById('totalTime');
    const completedCountSpan = document.getElementById('completedCount');
    const sortTasksSelect = document.getElementById('sortTasks');
    const exportTasksBtn = document.getElementById('exportTasks');
    const startPomodoroBtn = document.getElementById('startPomodoro');
    const pomodoroModal = document.getElementById('pomodoroModal');
    const pomodoroTimeDisplay = document.getElementById('pomodoroTime');

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <div class="timer-container">
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
                <span class="timer">${task.duration} min</span>
            </div>
            <div class="button-group">
                <button class="start-btn">Start</button>
                <button class="pause-btn" disabled>Pause</button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('input');
        const startBtn = li.querySelector('.start-btn');
        const pauseBtn = li.querySelector('.pause-btn');
        const timerSpan = li.querySelector('.timer');
        const progressBar = li.querySelector('.progress');

        let timeLeft;
        let duration;
        let timer;
        let isPaused = false;

        function updateProgress(timeLeft, duration) {
            const progress = (timeLeft / duration) * 100;
            progressBar.style.width = `${progress}%`;
        }

        function startTimer() {
            duration = task.duration * 60;
            timeLeft = duration;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            isPaused = false;

            timer = setInterval(() => {
                if (!isPaused) {
                    timeLeft--;
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    timerSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    updateProgress(timeLeft, duration);

                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        taskComplete.play();
                        task.completed = true;
                        checkbox.checked = true;
                        li.classList.add('completed');
                        startBtn.disabled = true;
                        pauseBtn.disabled = true;
                        saveTasks();
                        updateTaskCount();
                        
                        // Find next incomplete task
                        const nextTask = tasks.find(t => !t.completed);
                        if (nextTask) {
                            setTimeout(() => {
                                alert(`"${task.text}" completed! Next task: "${nextTask.text}"`);
                            }, 500);
                        } else {
                            setTimeout(() => {
                                alert('All tasks completed! Great job!');
                            }, 500);
                        }
                    }
                }
            }, 1000);
        }

        startBtn.addEventListener('click', startTimer);

        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        });

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            li.classList.toggle('completed');
            saveTasks();
            updateTaskCount();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            li.remove();
            saveTasks();
            updateTaskCount();
        });

        // Add category and priority indicators
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.innerHTML = `
            ${task.category ? `<span class="task-category">${task.category}</span>` : ''}
            <span class="task-priority ${task.priority}">${task.priority}</span>
            ${task.scheduledDate ? `<span class="task-schedule">
                <i class="far fa-calendar"></i> 
                ${new Date(task.scheduledDate).toLocaleString()}
            </span>` : ''}
        `;
        li.insertBefore(taskInfo, li.querySelector('.timer-container'));

        // Add notes toggle
        if (task.notes) {
            const notesBtn = document.createElement('button');
            notesBtn.className = 'notes-btn';
            notesBtn.innerHTML = '<i class="far fa-sticky-note"></i>';
            notesBtn.addEventListener('click', () => {
                alert(task.notes);
            });
            li.querySelector('.button-group').appendChild(notesBtn);
        }

        return li;
    }

    function renderTasks(filterType = 'all') {
        taskList.innerHTML = '';
        let filteredTasks = tasks;
        
        if (filterType === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filterType === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
    }

    addBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const duration = parseInt(taskDuration.value);
        if (text && duration) {
            const task = { 
                text, 
                completed: false, 
                duration: duration 
            };
            tasks.push(task);
            taskList.appendChild(createTaskElement(task));
            taskInput.value = '';
            taskDuration.value = '';
            saveTasks();
            updateTaskCount();
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    clearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(btn.dataset.filter);
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            addBtn.click(); // Add new task
        } else if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            startPomodoroBtn.click(); // Start Pomodoro
        }
    });

    // Save timer states before page unload
    window.addEventListener('beforeunload', () => {
        const activeTimers = tasks.map(task => ({
            id: task.id,
            timeLeft: task.timeLeft,
            isPaused: task.isPaused
        }));
        localStorage.setItem('activeTimers', JSON.stringify(activeTimers));
    });

    // Task statistics functions
    function updateStatistics() {
        const totalMinutes = tasks.reduce((acc, task) => acc + task.duration, 0);
        const completedTasks = tasks.filter(task => task.completed).length;
        
        totalTimeSpan.textContent = `${totalMinutes} min total`;
        completedCountSpan.textContent = `${completedTasks} completed`;
        updateTaskCount();
    }

    // Sort tasks function
    function sortTasks(sortBy) {
        switch(sortBy) {
            case 'priority':
                tasks.sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                });
                break;
            case 'duration':
                tasks.sort((a, b) => b.duration - a.duration);
                break;
            case 'scheduled':
                tasks.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
                break;
        }
        renderTasks();
    }

    // Export tasks function
    function exportTasks() {
        const exportData = {
            tasks: tasks,
            exportDate: new Date().toISOString(),
            statistics: {
                totalTasks: tasks.length,
                completedTasks: tasks.filter(task => task.completed).length,
                totalTime: tasks.reduce((acc, task) => acc + task.duration, 0)
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks-export-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Pomodoro timer functions
    function updatePomodoroDisplay(timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        pomodoroTimeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startPomodoro() {
        if (pomodoroTimer) clearInterval(pomodoroTimer);
        
        pomodoroTimer = setInterval(() => {
            pomodoroTime--;
            updatePomodoroDisplay(pomodoroTime);
            
            if (pomodoroTime <= 0) {
                clearInterval(pomodoroTimer);
                document.getElementById('pomodoroComplete').play();
                alert('Pomodoro session completed! Take a break.');
                pomodoroTime = 25 * 60;
                updatePomodoroDisplay(pomodoroTime);
            }
        }, 1000);
    }

    // Event Listeners
    sortTasksSelect.addEventListener('change', (e) => {
        sortTasks(e.target.value);
    });

    exportTasksBtn.addEventListener('click', exportTasks);

    startPomodoroBtn.addEventListener('click', () => {
        pomodoroModal.style.display = 'block';
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        pomodoroModal.style.display = 'none';
    });

    // Initial render
    renderTasks();
    updateTaskCount();
    updateStatistics();
}); 