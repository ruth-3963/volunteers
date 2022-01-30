import { StylesProvider } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { useErrorHandler } from "react-error-boundary";
import { UserContext } from "../../App";
import { serverURL } from "../../config/config";
import '../login/login.css';

export const ChangeManagerModal = ({group,setShowChangeManager}) => {
    const [submited,setSubmited] = useState(false);
    const [show,setShow] = useState(true);
    const {user} = useContext(UserContext);
    const handleError = useErrorHandler();
    const handleClose = () => { setShow(false); };

    const submit = async(isAgree) => {
        try{
            setSubmited(true);
            axios.post(`${serverURL}group/newManagerAnswer/${isAgree}`,
               {
                user_id:user.id,
                group_id:group.id
               }
            );
            await new Promise(r => setTimeout(r, 2000));
            setShowChangeManager(false); 
        }
        catch (err){
            handleError(err);
        }
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Set you to manager</Modal.Title>
            </Modal.Header>
            <Modal.Body>{group.mName} ({group.mEmail}) want that you manage {group.name} group</Modal.Body>
            <Modal.Footer >
                <Button onClick={() => submit(true)}>I agree</Button>
                <Button onClick={() => submit(false)} variant="secondary">I not aggree</Button>
                {submited && <b>we submitted your answer</b>}
            </Modal.Footer>
        </Modal>
    )
}