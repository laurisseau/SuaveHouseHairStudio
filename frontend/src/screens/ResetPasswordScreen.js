import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { getError } from "../utils";
import NavbarComp from "../components/NavbarComp";
import axios from "axios";

export default function ResetPasswordScreen() {
    const params = useParams();
    const { token } = params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(`/api/users/resetPassword/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <NavbarComp color="dark" />
      <div className="container small-container">
        <Helmet>
          <title>Reset Password</title>
        </Helmet>
        <h1 className="my-3">Reset Password</h1>
        <form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Change Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
