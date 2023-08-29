import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";

const LoginForm = () => {
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [login, { error }] = useMutation(LOGIN_USER);

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // calling the login function from an Apollo Client mutation, using data from the form
      const { data } = await login({
        variables: { ...formState },
      });
      // calling a login method on the Auth object and passing the login token as an argument
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
  };

  // initializing email and password as empty strings
  const [formState, setFormState] = useState({ email: "", password: "" });
  //
  const handleInputChange = (event) => {
    // grabs name and value of any of the input fields from the form
    const { name, value } = event.target;
    // uses the spread operator to create a new object that copies the existing formState and updates the property specified by the name with the new value
    // this approach ensures that the other properties of formState remain unchanged while only updating the property associated with the input field that triggered the change
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            value={formState.password}
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formState.email && formState.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
        {error && <div>Login failed</div>}
      </Form>
    </>
  );
};

export default LoginForm;
