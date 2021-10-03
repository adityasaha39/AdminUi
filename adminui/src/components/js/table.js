import React, { Component } from "react";
import { Table, Modal, Button ,message} from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import "../css/table.css";

// Component Description:- Table component

export default class table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRow: [],
      selectedKey: {},
      isModalVisible: false,
      editKey: "",
      editName: "",
      editEmail: "",
      editRole: "",
    };

    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        editable: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        editable: true,
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        editable: true,
      },
      {
        title: "Action",
        key: "key",
        render: () => {
          return (
            <>
              <EditTwoTone onClick={this.oneditable} /> &nbsp; &nbsp; &nbsp;{" "}
              <DeleteTwoTone onClick={this.ondeletable} />{" "}
            </>
          );
        },
      },
    ];
  }

  // Function:- Execute on edit icon
  oneditable = () => {
    setTimeout(this.showEditModel, 100);
  };

  // Function:- Execute on delete icon/delete selected bottom
  ondeletable = () => {
    setTimeout(this.showDeleteConfirm, 100);
  };

  // Function:- To send delete data to parent component
  showDeleteConfirm = () => {
    this.props.updateAfterDelete(this.state.selectedRow);
    message.success(`${this.state.selectedRow.length} item are deleted`);
  };

  // Function:- To implement the editable model
  showEditModel = () => {
    this.setState({
      editKey: this.state.selectedKey.key,
      editName: this.state.selectedKey.name,
      editEmail: this.state.selectedKey.email,
      editRole: this.state.selectedKey.role,
    });

    setTimeout(this.showModel, 100);
  };

  // Function:- To show model screen
  showModel = () => {
    this.setState({
      isModalVisible: true,
    });
    console.clear();
  };

  // Function:- To be executed on ok click in edit model
  handleOk = () => {
    let nameValue = document.getElementById("nameEdit").innerText;
    let emailValue = document.getElementById("emailEdit").innerText;
    let roleValue = document.getElementById("roleEdit").innerText;
    this.setState({
      isModalVisible: false,
    });

    this.props.updateAfterEdit(
      this.state.editKey,
      nameValue,
      emailValue,
      roleValue
    );
    message.success("Record is updated");
  };

  // Function:- To be executed on cancel click in edit model
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  render() {
    return (
      <div className="table">
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                this.setState({
                  selectedRow: [record.key],
                  selectedKey: record,
                });
              },
            };
          }}
          pagination={{ position: ["bottomCenter"] }}
          scroll={{ x: 700 }}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys) => {
              this.setState({
                selectedRow: selectedRowKeys,
              });
            },
          }}
          dataSource={this.props.data}
          columns={this.columns}
        />
        <Button onClick={this.ondeletable} type="primary" danger>
          Delete Selected
        </Button>

        <Modal
          title="Click to edit the required feild"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <label>Name:</label>
          <p contentEditable="true" id="nameEdit">
            {this.state.editName}.
          </p>
          <label>Email:</label>
          <p contentEditable="true" id="emailEdit">
            {this.state.editEmail}
          </p>
          <label>Role:</label>
          <p contentEditable="true" id="roleEdit">
            {this.state.editRole}
          </p>
        </Modal>
      </div>
    );
  }
}
