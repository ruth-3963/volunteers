import React, { useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { Form, Button } from 'react-bootstrap';
import { useEffect } from "react";
import serverURL from "../serverURL";
import axios from "axios";
import { useErrorHandler } from "react-error-boundary";

export const ResetPassword = () => {

    const { token } = useParams();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updated, setUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const errorHandler = useErrorHandler();
    const location = useLocation();
    const history = useHistory();
    const loading = {
        margin: '1em',
        fontSize: '24px',
    };
    const updatePassword = (e) => {
        e.preventDefault();
        axios.put(serverURL + "updatePasswordViaEmail", {
            email: userEmail,
            password: password
        }).then(response => {
            if (response.data === "password updated") {
                setUpdated(true);
                setError(false);
            }
            else {
                setUpdated(false);
                setError(true);
            }
        }).catch(err => errorHandler(err));
    }
    const handleChange = (e) => {
        setPassword(e.target.value);
    }

    useEffect(async () => {


        axios.get("https://localhost:44334/reset", {
            params: {
                resetPasswordToken: token
            },
        }).then(response => {
            if (response.data) {
                setUserEmail(response.data.email);
                setUpdated(false);
                setIsLoading(false);
                setError(false);
            }
            else {
                setUpdated(false);
                setIsLoading(false);
                setError(true);
            }
        }).catch(error => console.error(error));

    }, []);

    if (error) {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div style={loading}>
                        <h5><b>Problem resetting password. Please send another reset link.</b></h5>
                        <Link to="/" style={{float:'right'}}>Go Home</Link>
                        <Link to="/forgetPassword" >forgetPassword</Link>
                    </div>
                </div>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <div style={loading}>Loading User Data...</div>
                </div>
            </div>
        );
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <h3>Reset Password</h3>
                <Form onSubmit={updatePassword}>
                    <Form.Group className="mb-3" controlId="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="confirm password"
                            style={confirmPassword === password && password ? { borderColor: "green" } : { borderColor: "red" }} />
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button variant="outline-primary" block type="submit" disabled={updated}>Update</Button>
                    </div>
                </Form><br/>
                {updated && (
                    <div>
                        <h5 style={{textAlign:'center'}}>
                            Your password has been successfully reset, please try logging in
                            again.
                        </h5>
                        <Link to="/signin">Sign In</Link>

                        <Link to="/" style={{float:"right"}}>Go Home</Link>

                    </div>
                )}
            </div>
        </div>
    );

}

