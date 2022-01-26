import React from "react";
import { useState } from "react";
import './login.css';
import { CloseButton, Button } from 'react-bootstrap'
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import {serverURL} from "../../config/config";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [showError, setShowError] = useState(false);
    const [showNullError, setShowNullError] = useState(false);
    const [messageFromServer, setMessageFromServer] = useState("");
    const history = useHistory();
    const SendEmail = async (e) => {
        e.preventDefault();
        if (email === "") {
            setShowError(false);
            setMessageFromServer("");
            setShowNullError(true);
            return;
        }
        const result = await axios.get(serverURL + "forgetPassword", {
            params: {
                email: email
            }
        });
        if (result.data === "email not in db") {
            setShowError(true);
            setMessageFromServer("");
            setShowNullError(false);
        }
        else if (result.data = "recovery email sent") {
            setShowError(false);
            setMessageFromServer("recovery email sent");
            setShowNullError(false);
        }

    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={SendEmail}>
                    <CloseButton onClick={() => history.push("/home")} />
                    <h3>Reset password</h3>
                    <div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" id="email" name="email" className="form-control"
                                onChange={e => setEmail(e.target.value)} value={email} />
                        </div>
                        <br />   <div className="d-grid gap-2">
                            <Button variant="outline-primary" block type="submit">Submit</Button>
                        </div>
                    </div>
                </form>
                {showNullError && (<div><br /><b>The email address cannot be null</b></div>)}
                {showError && <div> <br />
                    <b>The email isn't recognized. Please try again or register for a new account</b>
                    <Link to="signup"></Link>
                </div>}
                {messageFromServer === "recovery email sent" && (<div><br />
                    <b>Password reset email successfuly sent</b>
                </div>)}
                {messageFromServer === "error email sent" && (<div><br />
                    <b>occours error on email sent</b>
                </div>)}

            </div>
        </div>
    )
}
export default ForgetPassword;