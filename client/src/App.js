import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

const App = () => {

  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8000');
    setSocket(socket);

    socket.on('updateData', (tasks) => {
      updateTasks(tasks);
    });

    socket.on('addTask', (task) => {
      addTask(task);
    });

    socket.on('removeTask', (id) => {
      removeTask(id);
    });
    
  }, []);

  const updateTasks = (tasksData) => {
    setTasks(tasksData);
  };

  const removeTask = (taskId, local) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    if (local) {
      socket.emit('removeTask', taskId);
    }
  };

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  }

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ name: taskName, id: shortid()});
    socket.emit('addTask', { name: taskName, id: shortid() });
  }

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className='task'>
              {task.name}
              <button 
                className='btn btn--red'
                onClick={() => removeTask(task.id)}
              > Remove </button>
            </li>
          ))}
        </ul>
  
        <form id="add-task-form" onSubmit={(e) => submitForm(e)}>
          <input 
            className="text-input" 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name" 
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;