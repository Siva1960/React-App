import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBSpinner,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBValidation,
  MDBValidationItem,
  MDBInput,
} from "mdb-react-ui-kit";
import admissionData from "../admissionData";

function Admissions() {
  const [data, setData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [universityData, setUniversityData] = useState([]);
  const [value, setValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(100);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");
  const [isLoading, setLoading] = useState(true);

  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => {
    setisFormEdit(false);
    setBasicModal(!basicModal);
  };

  const [basicEditModal, setBasicEditModal] = useState(false);

  const [formValue, setFormValue] = useState({
    fname: "Mark",
    lname: "Otto",
    email: "",
    city: "",
    state: "",
    zip: "",
  });

  const [isFormEdit, setisFormEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    cut_off: "",
    address: "",
    state: "",
    university: "",
    id: "",
  });

  const toggleEditShow = (id = "") => {
    setisFormEdit(true);
    if (Number.isInteger(id)) {
      let studentData = JSON.parse(
        localStorage.getItem("admissionData")
      ).admissionData;
      if (typeof studentData !== "undefined" && studentData.length > 0) {
        let formData = studentData[id];
        formData["id"] = id;
        setEditForm(formData);
      }
    }
    setBasicEditModal(!basicEditModal);
  };

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            let studentData = JSON.parse(
              localStorage.getItem("admissionData")
            ).admissionData;
            if (typeof studentData !== "undefined" && studentData.length > 0) {
              studentData.splice(id);
              setData(studentData);
              localStorage.setItem(
                "admissionData",
                JSON.stringify({ admissionData: studentData })
              );
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleStateUniversity = async (e) => {
    let value = e.target.value;
    let university = [];
    await axios
      .get(`http://localhost:5001/college_data?q=${value}`)
      .then((response) => {
        for (let st of response.data) {
          if (university.indexOf(st["name"]) === -1 && st["name"] !== null) {
            university.push(st["name"]);
          }
        }
        setUniversityData(university);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editForm.id);
    let admission_details = {};
    const data = new FormData(e.target);
    for (var [key, value] of data.entries()) {
      console.log(value);
      if (value === undefined || value === null || value === "") {
        alert("All fields are mandatory");
        return;
      } else if (key === "cut_off" && !/^\d+$/.test(value)) {
        alert("Cut off must be a integer value.");
        return;
      } else if (key === "name" && !/^[a-zA-Z]+$/.test(value)) {
        alert(value);
        alert("Name only allow alphabets.");
        return;
      }
      admission_details[key] = value;
    }
    let studentData = JSON.parse(
      localStorage.getItem("admissionData")
    ).admissionData;
    if (isFormEdit) {
      studentData[editForm.id] = admission_details;
    } else {
      studentData.push(admission_details);
    }
    setData(studentData);
    let studentDataDetails = { admissionData: studentData };
    localStorage.setItem("admissionData", JSON.stringify(studentDataDetails));
  };

  useEffect(() => {
    let studentData = JSON.parse(localStorage.getItem("admissionData"));
    if (!studentData) {
      localStorage.setItem("admissionData", JSON.stringify(admissionData));
    }
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    let studentData = JSON.parse(
      localStorage.getItem("admissionData")
    ).admissionData;
    setData(studentData);
    setLoading(true);
    return await axios
      .get(`http://localhost:5001/college_data`)
      .then((response) => {
        let state = [];
        let university = [];

        for (let st of response.data) {
          if (
            state.indexOf(st["state-province"]) === -1 &&
            st["state-province"] !== null
          ) {
            state.push(st["state-province"]);
          }
        }
        for (let st of response.data) {
          if (university.indexOf(st["name"]) === -1 && st["name"] !== null) {
            university.push(st["name"]);
          }
        }
        setUniversityData(university);
        setStateData(state);
        setTimeout(function () {
          setLoading(false);
        }, 300);
      })
      .catch((err) => console.log(err));
  };

  const renderPagination = () => {
    if (data.length < 10 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData(10, 20, 1, operation)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length * 10 === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUsersData(
                  (currentPage - 1) * 10,
                  currentPage * 10,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>

          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUsersData(
                  (currentPage + 1) * 10,
                  (currentPage + 2) * 10,
                  1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUsersData(
                  (currentPage - 1) * 10,
                  currentPage * 10,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <MDBContainer>
      <MDBBtn
        color="dark"
        onClick={toggleShow}
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
          marginLeft: "87%",
          marginBottom: "2%",
          marginTop: "2%",
        }}
      >
        Add new admission
      </MDBBtn>
      <MDBRow>
        <MDBCol size="12">
          <MDBTable>
            <MDBTableHead dark>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Student Name</th>
                <th scope="col">Student CutOff</th>
                <th scope="col">Student Address</th>
                <th scope="col">University</th>
                <th scope="col">State</th>
                <th scope="col">Actions</th>
              </tr>
            </MDBTableHead>
            {isLoading ? (
              <MDBSpinner role="status">
                <span className="visually-hidden">Loading...</span>
              </MDBSpinner>
            ) : data.length === 0 ? (
              <MDBTableBody className="align-center mb-0">
                <tr>
                  <td colSpan={8} className="text-center mb-0">
                    No Data Found
                  </td>
                </tr>
              </MDBTableBody>
            ) : (
              data.map((item, index) => (
                <MDBTableBody key={index}>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.cut_off}</td>
                    <td>{item.address}</td>
                    <td>{item.state}</td>
                    <td>{item.university}</td>
                    <td>
                      <MDBBtn
                        onClick={() => toggleEditShow(index)}
                        className="mx-1"
                        color="info"
                      >
                        Edit
                      </MDBBtn>
                      <MDBBtn
                        className="mx-1"
                        color="danger"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </MDBBtn>
                    </td>
                  </tr>
                </MDBTableBody>
              ))
            )}
          </MDBTable>
        </MDBCol>
      </MDBRow>
      <div
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "250px",
          alignContent: "center",
        }}
      >
        {renderPagination()}
      </div>
      {/* </div> */}

      <>
        <MDBModal
          show={basicModal}
          setShow={setBasicModal}
          tabIndex="-1"
          size="lg"
        >
          <MDBModalDialog size="xl">
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>New Addmission</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={toggleShow}
                ></MDBBtn>
              </MDBModalHeader>

              <MDBModalBody>
                <MDBValidation className="row g-3" onSubmit={handleSubmit}>
                  <MDBValidationItem className="col-md-6">
                    <MDBInput
                      name="name"
                      pattern="[a-zA-Z]+"
                      onChange={onChange}
                      id="validationCustom01"
                      required
                      label="Student name"
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className="col-md-6">
                    <MDBInput
                      name="cut_off"
                      pattern="[0-9]+"
                      onChange={onChange}
                      id="validationCustom02"
                      required
                      label="Student CutOff"
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className="col-md-6">
                    <MDBInput
                      name="address"
                      onChange={onChange}
                      id="validationCustom03"
                      required
                      label="Student Address"
                    />
                  </MDBValidationItem>

                  <MDBValidationItem className="col-md-6">
                    <select
                      style={{
                        width: "100%",
                        borderRadius: "2px",
                        height: "35px",
                      }}
                      name="state"
                      required
                      onChange={handleStateUniversity}
                    >
                      <option value="">Please Select State</option>
                      {stateData.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </MDBValidationItem>

                  <MDBValidationItem className="col-md-6">
                    <select
                      style={{
                        width: "100%",
                        borderRadius: "2px",
                        height: "35px",
                      }}
                      name="university"
                      required
                    >
                      <option value="">Please Select University</option>
                      {universityData.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </MDBValidationItem>
                  <div className="col-12">
                    <MDBBtn type="submit">Add</MDBBtn>
                    <MDBBtn type="reset">Reset</MDBBtn>
                  </div>
                </MDBValidation>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={toggleShow}>
                  Close
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>

      <MDBModal
        show={basicEditModal}
        setShow={setBasicEditModal}
        tabIndex="-1"
        size="lg"
      >
        <MDBModalDialog size="xl">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Addmission</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleEditShow}
              ></MDBBtn>
            </MDBModalHeader>

            <MDBModalBody>
              <MDBValidation className="row g-3" onSubmit={handleSubmit}>
                <MDBValidationItem className="col-md-6">
                  <MDBInput
                    name="name"
                    pattern="[a-zA-Z]+"
                    value={editForm.name}
                    onChange={onChange}
                    id="validationCustom01"
                    required
                    label="Student name"
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-md-6">
                  <MDBInput
                    name="cut_off"
                    value={editForm.cut_off}
                    pattern="[0-9]+"
                    onChange={onChange}
                    id="validationCustom02"
                    required
                    label="Student CutOff"
                  />
                </MDBValidationItem>
                <MDBValidationItem className="col-md-6">
                  <MDBInput
                    name="address"
                    value={editForm.address}
                    onChange={onChange}
                    id="validationCustom03"
                    required
                    label="Student Address"
                  />
                </MDBValidationItem>

                <MDBValidationItem className="col-md-6">
                  <select
                    style={{
                      width: "100%",
                      borderRadius: "2px",
                      height: "35px",
                    }}
                    name="state"
                    required
                    onChange={handleStateUniversity}
                  >
                    <option value="">Please Select State</option>
                    {stateData.map((item, index) =>
                      item === editForm.state ? (
                        <option value={item} key={index} selected>
                          {item}
                        </option>
                      ) : (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </MDBValidationItem>

                <MDBValidationItem className="col-md-6">
                  <select
                    style={{
                      width: "100%",
                      borderRadius: "2px",
                      height: "35px",
                    }}
                    name="university"
                    required
                  >
                    <option value="">Please Select University</option>
                    {universityData.map((item, index) =>
                      item === editForm.university ? (
                        <option value={item} key={index} selected>
                          {item}
                        </option>
                      ) : (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </MDBValidationItem>
                <div className="col-12">
                  <MDBBtn type="submit">Update</MDBBtn>
                  <MDBBtn type="reset">Reset</MDBBtn>
                </div>
              </MDBValidation>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleEditShow}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
}

export default Admissions;
