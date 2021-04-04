import React, { useEffect, useRef, useState } from "react"
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "daypilot-pro-react";
import { useLocation } from 'react-router-dom';
import "./CalendarStyles.css";
import axios from "axios";
import serverURL from "../serverURL";

const styles = {
    wrap: {
        display: "flex"
    },
    left: {
        marginRight: "10px"
    },
    main: {
        flexGrow: "1"
    }
};
const cells = [
    {
        start: "2021-09-17T10:30:00",
        end: "2021-09-17T13:00:00",
    },
    {
        start: "2021-09-15T10:30:00",
        end: "2021-09-15T13:00:00",
    },
    {
        start: "2021-09-16T10:30:00",
        end: "2021-09-16T13:00:00",
    },
]

const Calendar = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const location = useLocation();
    const [times ,setTimes] = useState(props.events)
    const [group, setGroup] = useState(location.state.group);

    useEffect(() => {
        if (location.state && location.state.edit)
            setIsEdit(true);
    }, [])
    
    const [style, setStyle] = useState({
        viewType: "Week",
        durationBarVisible: false,
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: args => {
            let dp = calendar.current;
            if (location.state.edit) {
                dp.clearSelection();
                dp.events.add(new DayPilot.Event({
                    start: args.start,
                    end: args.end,
                    id: DayPilot.guid(),
                    text: args.start.getHours() + ":" + (args.start.getMinutes() ? args.start.getMinutes() : "00") + " - " +
                        args.end.getHours() + ":" + (args.end.getMinutes() ? args.end.getMinutes() : "00")
                }));
            }
            else {
                DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function (modal) {
                    dp.clearSelection();
                    if (!modal.result) { return; }
                    dp.events.add(new DayPilot.Event({
                        start: args.start,
                        end: args.end,
                        id: DayPilot.guid(),
                        text: modal.result
                    }));
                });
            }

        }, startDate: '2021-09-15',
        events: [...props.events],
        // events: [{
        //     id: 1,
        //     text: "Event 1",
        //     start: "2021-09-13T10:30:00",
        //     end: "2021-09-13T13:00:00",
        //     moveDisabled: true,
        //     clickDisabled: true,
        //     resizeDisabled: true,
        //     deleteDisabled: true,
        // },
        // {
        //     id: 2,
        //     text: "Event 2",
        //     start: "2021-09-14T09:30:00",
        //     end: "2021-09-14T11:30:00",
        //     backColor: "#38761d"
        // },
        // {
        //     id: 2,
        //     text: "Event 3",
        //     start: "2021-09-14T12:00:00",
        //     end: "2021-09-14T15:00:00",
        //     backColor: "#cc4125"
        // }],
        eventDeleteHandling: "Update",
        onEventClick: args => {
            let dp = calendar.current;
            DayPilot.Modal.prompt("Update event text:", args.e.text()).then(function (modal) {
                if (!modal.result) { return; }
                console.log(args);
                args.e.data.text = modal.result;
                dp.events.update(args.e);
            });
        },
        onBeforeCellRender: args => {
             if (cells.filter(c => args.cell.start >= c.start && args.cell.end <= c.end).length > 0) {
                 args.cell.backColor = "#a0e1ec";
             }
             else {
                 args.cell.disabled = true;
             }
        },
        onEventEdited: args => {
            console.log("event edit", args);
        }
    });
    useEffect(() => {        
        console.log(props.events);
        setTimes(props.events);
        if(calendar.current && props.events.length >0)
        {
            calendar.current.cellProperties["0_25"].backColor="red";
            console.log( calendar.current.cellProperties["0_25"].backColor);
            calendar.current.cellProperties["3_25"].backColor = "blue"
            console.log( calendar.current.cellProperties["0_25"].start);
        }
        
        // setStyle({...style, 
        //     events:props.events.slice() 
        // });
    }, [props.events])
    //const [events, setEvents] = useState([])
    //const [startDate, setStartDate] = useState("2021-09-15");
    const calendar = useRef(null);
    // useEffect(() => {
    //setEvents();
    // setStartDate('2021-09-10')
    // }, [])
    const Paint = () => {
        const start = "2021-09-15T12:00:00";
        const end = "2021-09-15T15:00:00";
        //  calendar.current.Row.cells.forRange(start, end).backColor = "red";
    }
    const sendEventsToDb = async () => {
        const result = await axios.put("" + serverURL + "api/Event", {
            events: calendar.current.events.list,
            group: group
        });
        console.log(result);
    }
    return (
        <div style={styles.wrap}>
            <div style={styles.left}>
                <DayPilotNavigator
                    selectMode={"week"}
                    showMonths={3}
                    skipMonths={3}
                //onTimeRangeSelected={args => {
                //    setStartDate(args.day)
                //}}
                />
            </div>
            <div style={styles.main}>
                <DayPilotCalendar

                    {...style}
                    // {...events}

                    ref={component => {
                        calendar.current = component && component.control;
                    }}

                />
            </div>
            <button onClick={() => Paint()}>Paint cells</button>
            <button onClick={() => sendEventsToDb()}>calender</button>
        </div>)
}
export default Calendar;