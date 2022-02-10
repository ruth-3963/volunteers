import React, { useState, useEffect } from "react";
import './login.css';
import { useFormik } from 'formik';
import { useHistory } from "react-router";
import axios from 'axios';
import {serverURL} from '../../config/config';
import { CloseButton } from 'react-bootstrap';
import { useContext } from "react";
import { UserContext } from "../../App";
import { useErrorHandler } from "react-error-boundary";

const SignUp = ({ location }) => {
    const email = new URLSearchParams(location.search).get("email")?.replace("/", "");
    const history = useHistory();
    const [matchPassword, setMatchPassword] = useState(false);
    const { setUser } = useContext(UserContext)
    const handleError = useErrorHandler();
    const formik = useFormik({
        initialValues: {
            name: '',
            email: email ? email : '',
            password: '',
            phone: '',
            confirm_password: '',
            group: ''
        },
        onSubmit: async (values) => {
            if (matchPassword) {
                const user = {};
                user.name = values.name;
                user.email = values.email;
                user.password = values.password;
                user.phone = values.phone;
                try {
                    const result = await axios.post(serverURL + "api/User", {
                        name: user.name,
                        password: user.password,
                        phone: user.phone,
                        email: user.email
                    });
                    setUser(result.data);
                    history.push("/signin");
                  
                }
                catch (err) {
                    handleError(err);
                }
            }
            else {
                alert("the passwords doesnt match");
            }
        },

    });
    const changePassword = () => {
        const password = formik.values.password;
        const confirm_password = formik.values.confirm_password;
        if (password && confirm_password && password === confirm_password)
            setMatchPassword(true);
        else setMatchPassword(false);
    }

    useEffect(changePassword, [formik.values.password, formik.values.confirm_password])
    
    return (

        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={formik.handleSubmit} >
                    <CloseButton onClick={() => history.push("/home")} />
                    <h3>Sign Up</h3>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" id="name" name="name" className="form-control"
                            onChange={formik.handleChange} value={formik.values.name} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="email" name="email" className="form-control"
                            onChange={formik.handleChange} value={formik.values.email} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" id="password" name="password" className="form-control"
                            onChange={formik.handleChange} value={formik.values.password} />
                    </div>

                    <div className="form-group">
                        <label>confirm password</label>
                        <input type="password" id="confirm_password" name="confirm_password"
                            onChange={formik.handleChange} value={formik.values.confirm_password}
                            className={matchPassword ? "form-control" : "form-control confirm_password_incorrect"} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" id="phone" name="phone" className="form-control"
                            onChange={formik.handleChange} value={formik.values.phone} />
                    </div>
                    <br />

                    <button type="submit" className="btn btn-primary btn-block">Create</button>

                </form>
            </div>
            </div>
    );
}
export default SignUp;