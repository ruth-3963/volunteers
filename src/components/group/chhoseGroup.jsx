import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory, useLocation } from 'react-router-dom';
import {serverURL} from '../serverURL';
const ChooseGroup = (props) => {
    
    //hear i need have the mail of manager
    return (
        <><Form.Group >
            <Form.Label>select group</Form.Label>
            <Form.Control as="select" id="group" name="group" value={props.group} onChange={()=>props.handleChange()}>
                {props.listOfGroups.map((item, step) =>
                    <option key={step} title={"manager : " + item.mName + "(" + item.mEmail + ")"}>
                        {item.name} </option>
                )}
                <option key={props.listOfGroups ? props.listOfGroups.length : 0}>create new group</option>
            </Form.Control>
        </Form.Group><br /> <Button variant="primary" block onClick={() => props.submitAllValue()}>Submit</Button></>
    )}
export default ChooseGroup;
