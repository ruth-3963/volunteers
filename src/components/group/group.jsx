import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import { GroupContext } from '../../App';
import { serverURL } from '../../config/config';
import { Button, Card } from "react-bootstrap";
import { GetColorName } from 'hex-color-to-color-name';

import './group.css'
const Group = () => {
        const { group, setGroup } = useContext(GroupContext);
        const errorHandler = useErrorHandler();
        const [users, setUsers] = useState([]);
        const [manager, setManager] = useState(null);
        const [oldUsers, setOldUsers] = useState([]);
        const [showOldUsers, setShowOldUsers] = useState(false);
        useEffect(() => {
                axios.get(`${serverURL}api/UsersToGroups`, {
                        params: {
                                groupId: group.id
                        }
                }).then(result => {
                        if (result.data && result.data.length) {
                                let newUsers = result.data.map(e => ({ ...e.user, color: e.color,isDeleted:e.isDeleted })).filter(e => !e.isDeleted)
                                newUsers.sort((a, b) => a.name ? (b.name ? checkString(a.name, b.name) : -1) : (b.name ? 1 : checkString(a.email, b.email)))
                                setUsers(newUsers);
                                let newOldUsers = result.data.map(e => ({ ...e.user, color: e.color,isDeleted:e.isDeleted })).filter(e => e.isDeleted);
                                newOldUsers.sort((a, b) => a.name ? (b.name ? checkString(a.name, b.name) : -1) : (b.name ? 1 : checkString(a.email, b.email)))
                                setOldUsers(newOldUsers);
                                setManager(result.data.find(d => d.user.id === group.id_manager)?.user);
                        }
                }).catch(err => errorHandler(err));
                const checkString = (a, b) => {
                        if (a > b) return 1
                        if (b > a) return -1;
                        return 0;

                }
        }, []);
        return (<div className='group-container'>
                <div class="group-details">
                        <h3>{group.name}</h3>
                        <h4>{group.description}</h4>
                        {manager && <><b>Manager : </b><span>{manager.name && manager.name + " - "}<a href={`mailto:${manager.email}`}>{manager.email}</a>  </span></>}
                        {users.length > 0 && <><br /><b>Num of volunteers : </b><span>{users.length}</span></>}
                        <br />
                </div>
                {users.length > 0 &&
                        <div className='group-user-list'>
                                <h2>Volunteers</h2>
                                <div style={{ width: '60vh', overflowY: 'auto' }}>
                                        {users.map(u =>
                                                <Card >
                                                        <Card.Body>
                                                                {u.name && <Card.Title >{u.name}</Card.Title>}
                                                                <Card.Text >
                                                                        <b>Email : </b><a href={`mailto:${u.email}`}>{u.email}</a>
                                                                        {u.phone && <><br /><b>Phone : </b><span>{u.phone}</span></>}
                                                                        {u.color && <><br /><b>Color : </b><div style={{ display: 'inline', backgroundColor: u.color }}>{GetColorName(u.color)}</div></>}
                                                                </Card.Text>
                                                        </Card.Body>
                                                </Card>
                                        )} 
                                {oldUsers.length > 0 && <>
                                        <Button variant='link' onClick={() => setShowOldUsers(!showOldUsers)}>{showOldUsers ?  "hide old users" : "show old users" }</Button>
                                        {showOldUsers && oldUsers.map(u =>
                                                <Card >
                                                        <Card.Body>
                                                                {u.name && <Card.Title >{u.name}</Card.Title>}
                                                                <Card.Text >
                                                                        <b>Email : </b><a href={`mailto:${u.email}`}>{u.email}</a>
                                                                        {u.phone && <><br /><b>Phone : </b><span>{u.phone}</span></>}
                                                                        {u.color && <><br /><b>Color : </b><div style={{ display: 'inline', backgroundColor: u.color }}>{u.color}</div></>}
                                                                </Card.Text>
                                                        </Card.Body>
                                                </Card>
                                        )} </>
                                }</div>
                        </div>}
        </div >)
}
export default Group;