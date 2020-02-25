import React, { Component } from "react";
import "./App.css";
import axios from "axios";

export class App extends Component {
  state = {
    todoList: [],
    activeItem: {
      id: null,
      title: "",
      completed: false
    },
    editing: false
  };

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = () => {
    // console.log("Fetching");
    axios.get("/api/task-list/").then(res => {
      this.setState({ todoList: res.data });
    });
  };

  handleChange = e => {
    // let name = e.target.name
    // let value = e.target.value
    // this.setState({
    //   activeItem:{
    //     ...this.state.activeItem,
    //     title:value
    //   }
    // })
    this.setState({
      [e.target.name]: e.target.value,
      activeItem: {
        ...this.state.activeItem,
        title: e.target.value
      }
    });
  };

  handleSubmit = e => {
    // const { activeItem } = this.state;
    let activeItem = JSON.stringify(this.state.activeItem)
    e.preventDefault();
    console.log("ITEM", activeItem);
    axios
      .post("/api/task-create/", { activeItem })
      .then(res => {
        console.log('res:',res.data);
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false
          }
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    var tasks = this.state.todoList;
    var self = this;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    value={this.state.activeItem.title}
                    type="text"
                    name="title"
                    placeholder="Add task.."
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    className="btn btn-warning"
                    type="submit"
                    name="Add"
                  />
                </div>
              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {tasks.map((task, index) => {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() => self.strikeUnstrike(task)}
                    style={{ flex: 7 }}
                  >
                    {task.completed === false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.startEdit(task)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.deleteItem(task)}
                      className="btn btn-sm btn-outline-dark delete"
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
