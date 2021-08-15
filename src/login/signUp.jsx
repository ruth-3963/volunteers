import React, { useState, useEffect } from "react";
import './login.css';
import { useFormik } from 'formik';
import { useHistory } from "react-router";
import axios from 'axios';
import serverURL from '../serverURL';

const SignUp = () => {
    const history = useHistory();
    const [matchPassword, setMatchPassword] = useState(false);


    const formik = useFormik({
        initialValues: {
            name: '',
            mail: '',
            password: '',
            address: '',
            phone: '',
            confirm_password: ''
        },
        onSubmit: values => {
            if (matchPassword) {
                const user = {};
                user.name = values.name;
                user.email = values.mail;
                user.password = values.password;
                user.address = values.address;
                user.phone = values.phone;
                axios.post("" + serverURL + "api/User", {
                   name : user.name,
                   password: user.password,
                   address:user.address,
                   phone : user.phone,
                   email: user.email
                })
                history.push("/signin");
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
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" id="name" name="name" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="mail" name="mail" className="form-control"
                            onChange={formik.handleChange} value={formik.values.mail} />
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
                    <div className="form-group">
                        <label>Adrress</label>
                        <input type="text" id="address" name="address" className="form-control"
                            onChange={formik.handleChange} value={formik.values.address} />
                    </div><br />

                    <button type="submit" className="btn btn-primary btn-block">Create</button>

                </form>
            </div>
        </div>
    );
}
export default SignUp;