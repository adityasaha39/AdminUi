import React, { Component } from "react";
import { Select,Input,message } from "antd";
import Table from "../js/table";
import "../css/home.css";
import "antd/dist/antd.css";

const { Option } = Select;
const { Search } = Input;

// Component Description:- This is main body of AdminUI Home page

export default class home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBy: "",
      searchInput: "",
      totalDataRecieved: 0,
      dataFetched: [],
      loadingApi: false,
      data: [],
      dataCount: 0,
      filteredData: [],
    };
  }

  componentDidMount() {
    this.fetchApi();
  }

  //Function:-  To fectch the data from API
  async fetchApi() {
    try {
      this.setState({
        loadingApi: true,
      });
      await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            totalDataRecieved: data.length,
            dataFetched: data,
          })
        );

      this.setState({
        data: this.state.dataFetched.map((item) => {
          const { id: key, ...rest } = item;
          return { key, ...rest };
        }),
        dataCount: this.state.totalDataRecieved,
        loadingApi: false,
      });

      this.setState({
        filteredData: this.state.data,
      });
    } catch (e) {
      console.log(e);
    }
  }

  // Function:- To handle the change of serach type
  handleChange = (value) => {
    this.setState({
      searchBy: value,
    });
  };

  // Function:-  To handle on search changes in the search input
  onSearch = (value) => {
    this.setState({
      searchInput: value,
    });

    if (this.state.searchBy === "") {
      message.warn("Please select the search type first");
    } else if (this.state.searchBy === "name") {
      this.setState({
        filteredData: this.state.data.filter((item) => {
          return item.name.toLowerCase().includes(value.toLowerCase());
        }),
      });
    } else if (this.state.searchBy === "email") {
      this.setState({
        filteredData: this.state.data.filter((item) => {
          return item.email.toLowerCase().includes(value.toLowerCase());
        }),
      });
    } else if (this.state.searchBy === "role") {
      this.setState({
        filteredData: this.state.data.filter((item) => {
          return item.role.toLowerCase().includes(value.toLowerCase());
        }),
      });
    }
  };

  // Function:- To update the data in memory on deletable items
  // Function Parameters:- Deletable key in form of array
  updateAfterDelete = (deleteArray) => {
    this.setState({
      data: this.state.data.filter((item) => {
        return !deleteArray.includes(item.key);
      }),
    });

    this.setState({
      filteredData: this.state.data,
    });
  };

  // Function:- To update the data in memory on editable items
  // Function Parameters:- editableKey, editableName, editaleEmail,editableRole
  updateAfterEdit = (key, name, email, role) => {
    this.setState({
      data: this.state.data.map((item) => {
        if (item.key === key) {
          item.name = name;
          item.email = email;
          item.role = role;
          return item;
        }
        else{
          return item;
        }
      }),
    });

    this.setState({
      filteredData: this.state.data,
    });
   
  };

  render() {
    return (
      <div className="container-body">
        {/* This is a search header section it contain two components search type and search input */}

        <div className="search-header">
          <Select
            placeholder="Search By"
            style={{ width: 200 }}
            onChange={this.handleChange}
          >
            <Option value="name">Name</Option>
            <Option value="email">Email</Option>
            <Option value="role">Role</Option>
          </Select>

          <Search
            placeholder="input search text"
            onSearch={this.onSearch}
            style={{ width: 800 }}
            enterButton
          />
        </div>

        {/* This div is for the table  */}
        <Table
          data={this.state.filteredData}
          updateAfterDelete={this.updateAfterDelete}
          updateAfterEdit={this.updateAfterEdit}
        />

        {/* Footer */}
        <p className="footer">Greekstart Forntend Challenge:- AdminUI 	&#169; Aditya Saha | 2021</p>
      </div>
    );
  }
}
