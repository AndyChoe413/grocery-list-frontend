import React, { Component } from 'react';
import axios from 'axios';
import GroceryList from './GroceryList';
import "./Grocery.css";

const URL = 'http://localhost:3001';
export class Grocery extends Component {

  state = {
    groceryList: [],
    groceryListInput: '',
    error: null,
    errorMessage: '',
  };

  async componentDidMount() {
    try {

      let fullList = await axios.get(`${URL}/api/groceries/get-all-groceries`);

      this.setState({
        groceryList: fullList.data.payload,
      });

    } catch (e) {
      console.log(e);
    }
  }

  handleOnChange = (event) => {
    this.setState({
      groceryListInput: event.target.value,
      error: null,
      errorMessage: "",
    });
  };

  handleOnSubmit = async (event) => {
    event.preventDefault();

    if (this.state.groceryListInput.length === 0) {
      this.setState({
        error: true,
        errorMessage: "Cannot create empty list",
      });

    } else {

      let checkIfListAlreadyExists = this.state.groceryList.findIndex(
        (item) =>
          item.grocery.toLocaleLowerCase() ===
          this.state.groceryListInput.toLocaleLowerCase()
      );

      if (checkIfListAlreadyExists > -1) {
        this.setState({
          error: true,
          errorMessage: "Item already exists",
        });

      } else {

        try {
          let createdList = await axios.post(`${URL}/api/groceries/create-groceries`, {
            grocery: this.state.groceryListInput,
          });
          console.log(createdList);
          let newArray = [...this.state.groceryList, createdList.data.payload];
          this.setState({
            groceryList: newArray,
            groceryListInput: "",
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  handleDeleteByID = async (_id) => {
    try {
      let deletedList = await axios.delete(
        `${URL}/api/groceries/delete-groceries-by-id/${_id}`
      );
      let filteredArray = this.state.groceryList.filter(
        (item) => item._id !== deletedList.data.payload._id
      );
      this.setState({
        groceryList: filteredArray,
      });
    } catch (e) {
      console.log(e);
    }
  };


  handlePurchasedByID = async (id, purchased) => {
    //console.log(id, isDone);
    try {
      let purchasedUpdated = await axios.put(
        `${URL}/api/groceries/update-groceries-by-id/${id}`,
        {
          purchased: !purchased,
        }
      );
      let updatedArray = this.state.groceryList.map((item) => {
        if (item._id === purchasedUpdated.data.payload._id) {
          item.purchased = purchasedUpdated.data.payload.purchased;
        }
        return item;
      });
      this.setState({
        groceryList: updatedArray,
      });
    } catch (e) {
      console.log(e);
    }
  };


  handleEditByID = async (id, editInput) => {

    try {
      let editedList = await axios.put(
        `${URL}/api/groceries/update-groceries-by-id/${id}`,
        {
          grocery: editInput,
        }
      );


      let updatedArray = this.state.groceryList.map((item) => {

        if (item._id === id) {
          item.grocery = editedList.data.payload.grocery;
        }
        return item;
      });

      this.setState({
        groceryList: updatedArray,
      });
    } catch (e) {
      console.log(e);
    }
  };

  sortByDate = async (sortOrder) => {
    console.log(sortOrder);
    try {
      let sortedList = await axios.get(
        `${URL}/api/groceries/get-groceries-by-sort?sort=${sortOrder}`
      );

      this.setState({
        groceryList: sortedList.data.payload,
      });
    } catch (e) {
      console.log(e);
    }
  };

  sortByPurchased = async (purchased) => {
    try {
      let purchasedArray = await axios.get(
        `${URL}/api/groceries/get-groceries-by-purchased?purchased=${purchased}`
      );

      this.setState({
        groceryList: purchasedArray.data.payload,
      });
    } catch (e) {
      console.log(e);
    }
  };


  render() {
    return (
      <div>
        <div className="form-div">
          <form onSubmit={this.handleOnSubmit}>
            <input
              name="groceryListInput"
              type="text"
              onChange={this.handleOnChange}
              value={this.state.groceryListInput}
              autoFocus
              id="inputList"
            />
            <button type="submit">Submit</button>
            <br />
            <span style={{ color: "red" }}>
              {this.state.error && this.state.errorMessage}
            </span>
          </form>
        </div>

        <div className="sorting">
          <ul>
            <li>
              <button onClick={() => this.sortByDate("desc")}>
                Sort by Date - Newest to oldest
              </button>
            </li>
            <li>
              <button onClick={() => this.sortByDate("asc")}>
                Sort by Date - Oldest to newest
              </button>
            </li>
            <li>
              <button onClick={() => this.sortByPurchased("true")}>
                Sort by purchased
              </button>
            </li>
            <li>
              <button onClick={() => this.sortByPurchased("false")}>
                Sort by Not purchased
              </button>
            </li>
          </ul>
        </div>{" "}
        <div className="grocery-list-div">
          <ul>
            {this.state.groceryList.map((item, index) => {
              return (
                <GroceryList
                  key={item._id}
                  item={item}
                  handleDeleteByID={this.handleDeleteByID}
                  handlePurchasedByID={this.handlePurchasedByID}
                  handleEditByID={this.handleEditByID}
                  inputID={item._id}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}


export default Grocery;
