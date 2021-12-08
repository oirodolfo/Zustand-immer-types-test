import React, { memo } from "react";
import ReactDOM from "react-dom";
import uuid from "uuid";

import createStore from "./createStore";
import "./styles.css";

const firstId = uuid.v4();
const [useStore, dispatch] = createStore(
  {
    addCounter: draft => {
      const id = uuid.v4();
      draft.counter.allIds.push(id);
      draft.counter.byId[id] = { count: 0, description: `bar${id}` };
    },
    removeCounter: (draft, removedId) => {
      const index = draft.counter.allIds.indexOf(removedId);
      draft.counter.allIds.splice(index, 1);
      delete draft.counter.byId[removedId];
    },
    updateFoo: (draft, id, newValue) => {
      draft.counter.byId[id].description = newValue;
    },
    increase: (draft, id, value) =>
      typeof value === "number"
        ? (draft.counter.byId[id].count += value)
        : draft.counter.byId[id].count++,
    decrease: (draft, id) => draft.counter.byId[id].count--
  },
  {
    counter: {
      allIds: [firstId],
      byId: { [firstId]: { count: 0, description: `foo${firstId}` } }
    }
  }
);

function App() {
  const countersIds = useStore(state => state.counter.allIds);
  console.log("App rendered!");
  return (
    <div className="App">
      <button onClick={dispatch.addCounter}>Add counter</button>
      <table>
        <tbody>
          <tr>
            <td>
              {countersIds.map(id => (
                <Counter key={id} id={id} />
              ))}
            </td>
            <td>
              {countersIds.map(id => (
                <CounterDescriptionEditor key={id} id={id} />
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const Counter = memo(props => {
  console.log("Counter rendered!", props.id);
  return (
    <div className="Counter">
      <h3>Counter</h3>
      <small>Id: {props.id}</small>
      <CounterValue id={props.id} />
      <button onClick={() => dispatch.removeCounter(props.id)}>
        Remove counter
      </button>
      <CounterSummary id={props.id} />
    </div>
  );
});

const CounterValue = props => {
  const count = useStore(state => state.counter.byId[props.id].count);
  console.log("CounterValue rendered!", props.id);

  return (
    <>
      <div>Value: {count}</div>
      <div>
        <button onClick={() => dispatch.increase(props.id)}>Increment</button>
        <button onClick={() => dispatch.decrease(props.id)}>Decrement</button>
        <button onClick={() => dispatch.increase(props.id, 2)}>
          Increment +2
        </button>
      </div>
    </>
  );
};

const CounterSummary = props => {
  const description = useStore(
    state => state.counter.byId[props.id].description
  );
  console.log("CounterSummary rendered!", props.id);
  return (
    <div className="CounterSummary">
      <small>Description: {description}</small>
    </div>
  );
};

const CounterDescriptionEditor = memo(props => {
  const description = useStore(
    state => state.counter.byId[props.id].description
  );
  const inputName = `${props.id}-description`;
  console.log("CounterDescriptionEditor rendered!", props.id);

  return (
    <div className="Foo">
      <label htmlFor={inputName}>Counter's description editor:</label>
      <div>
        <small>({props.id})</small>
      </div>
      <input
        id={inputName}
        type="text"
        value={description}
        onChange={({ target: { value } }) =>
          dispatch.updateFoo(props.id, value)
        }
      />
      <br />
      <br />
    </div>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
