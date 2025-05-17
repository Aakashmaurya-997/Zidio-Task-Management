function TaskCard({ task }) {
    return (
      
      <div className="border p-4 rounded shadow mb-4">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p>{task.description}</p>
        <p className="text-sm">Priority: {task.priority}</p>
        <p className="text-sm">Status: {task.status}</p>
        <p className="text-sm">Due: {task.dueDate?.slice(0, 10)}</p>
      </div>
    );
  }
  
  export default TaskCard;
  