import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    let toDoContent = window.prompt("Todo content")
    if (toDoContent) {
      client.models.Todo.create({ content: toDoContent });
    } else {
      alert('Please enter a to do')
    }

  }

  function updateTodo(id: string, content: string) {
    let todoUpdate = window.prompt("Edit to do", content)
    if (todoUpdate) {
      client.models.Todo.update({ id, content: todoUpdate })
    } else {
      alert('Please enter a to do')
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (

    <Authenticator>
      {({ signOut }) => (
        <main>
          <h1>To do list</h1>
          <button onClick={createTodo}>+ add To do</button>
          <ul>
            {todos.map((todo) => (
              <li
                key={todo.id}>{todo.content}
                <button onClick={() => deleteTodo(todo.id)}> Delete </button>
                <button onClick={() => updateTodo(todo.id, todo.content!)}> Edit </button>
              </li>
            ))}
          </ul>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
