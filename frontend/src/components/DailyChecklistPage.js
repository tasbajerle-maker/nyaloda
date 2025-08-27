import React from 'react';

function DailyChecklistPage({ tasks, taskLog, onToggleTask, onNavigate }) {
    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Napi Küldetés</h2>
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza</button>
            </header>
            <main>
                <ul className="checklist">
                    {tasks.map(task => {
                        const isCompleted = taskLog.some(log => log.taskId === task.id);
                        return (
                            <li key={task.id} className={isCompleted ? 'completed' : ''}>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="task-checkbox"
                                        checked={isCompleted}
                                        onChange={() => onToggleTask(task.id, !isCompleted)}
                                    />
                                    <span>{task.text}</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </main>
        </div>
    );
}

export default DailyChecklistPage;