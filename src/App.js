import * as React from 'react';

const initialTodos = [
  {
    id: 'a',
    task: 'Learn React',
    complete: false,
  },
  {
    id: 'b',
    task: 'Learn Firebase',
    complete: false,
  },
];

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'DO_TODO':
      return state.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, complete: true };
        } else {
          return todo;
        }
      });
    case 'UNDO_TODO':
      return state.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, complete: false };
        } else {
          return todo;
        }
      });
    default:
      return state;
  }
};

const loggerBefore = (action, state) => {
  console.log('logger before:', action, state);
};

const loggerAfter = (action, state) => {
  console.log('logger after:', action, state);
};

const useReducerWithMiddleware = (
  reducer,
  initialState,
  middlewareFns,
  afterwareFns
) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const aRef = React.useRef();

  const dispatchWithMiddleware = (action) => {
    middlewareFns.forEach((middlewareFn) =>
      middlewareFn(action, state)
    );

    aRef.current = action;

    dispatch(action);
  };

  React.useEffect(() => {
    if (!aRef.current) return;

    afterwareFns.forEach((afterwareFn) =>
      afterwareFn(aRef.current, state)
    );
    
    aRef.current = null;
  }, [afterwareFns, state]);

  return [state, dispatchWithMiddleware];
};

const App = () => {
  const [todos, dispatch] = useReducerWithMiddleware(
    todoReducer,
    initialTodos,
    [loggerBefore],
    [loggerAfter]
  );

  const handleChange = (todo) => {
    dispatch({
      type: todo.complete ? 'UNDO_TODO' : 'DO_TODO',
      id: todo.id,
    });
  };

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.complete}
              onChange={() => handleChange(todo)}
            />
            {todo.task}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default App;
