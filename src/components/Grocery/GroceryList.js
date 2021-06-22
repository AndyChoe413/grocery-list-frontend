import React, { Component } from 'react';
import "./GroceryList.css";

export class GroceryList extends Component {

  state = {
    canEdit: false,
    editInput: this.props.item.grocery,
  };

  onHandleEditClick = () => {
    this.setState((prevState) => {
      return {
        canEdit: !prevState.canEdit,
      };
    });
  };

  componentDidUpdate() {
    let input = document.getElementById(this.props.inputID);
    if (input) {
      input.focus();
    }
  }

  handleEditOnChange = (event) => {
    this.setState({
      editInput: event.target.value,
    });
  };

  onHandleEditSubmit = (id) => {
    this.onHandleEditClick();
    this.props.handleEditByID(id, this.state.editInput);
  };

  render() {
    const { grocery, _id, purchased } = this.props.item;
    const { handleDeleteByID, handlePurchasedByID, inputID } = this.props;
    const { canEdit, editInput } = this.state;
    return (
      <div className="grocery-list-div">
        {canEdit ? (
          <input
            type="text"
            value={editInput}
            onChange={this.handleEditOnChange}
            name="editInput"
            id={inputID}
          />
        ) : (
          <li className={`li-style ${purchased ? "li-style-isDone" : ""}`}>
            {grocery}
          </li>
        )}
        {canEdit ? (
          <button onClick={() => this.onHandleEditSubmit(_id)} id="edit-button">
            Submit
          </button>

        ) : (
          <button onClick={this.onHandleEditClick} id="edit-button">
            Edit
          </button>

        )}
        <button id="purchased-button" onClick={() => handlePurchasedByID(_id, purchased)}>
          Purchased
        </button>

        <button onClick={() => handleDeleteByID(_id)} id="delete-button">
          Delete
        </button>

      </div>
    );
  }
}

export default GroceryList;
