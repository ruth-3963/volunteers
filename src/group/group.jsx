import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import serverURL from '../serverURL';
const Group = () => {
        const location = useLocation();
        const [group, setGroup] = useState(location.state.group);
        const [events, setEvents] = useState([]);
        useEffect(async() => {
                const result = await axios.get("" + serverURL + "api/Group", {
                        params: {
                                id : group.id,
                        }
                });
                setGroup(result.data);
                setEvents(JSON.parse(result.data.events));
        }, [])

        return <p ></p>
}
export default Group;