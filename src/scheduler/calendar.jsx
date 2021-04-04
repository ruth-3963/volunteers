import React, { Component } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "daypilot-pro-react";
import "./CalendarStyles.css";

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

class Calendar extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      
        viewType: "Week",
        durationBarVisible: false,
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: args => {
          let dp = this.calendar;
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
        },
        eventDeleteHandling: "Update",
        onEventClick: args => {
          let dp = this.calendar;
          DayPilot.Modal.prompt("Update event text:", args.e.text()).then(function (modal) {
            if (!modal.result) { return; }
            console.log(args);
            args.e.data.text = modal.result;
            dp.events.update(args.e);
          });
        },
        onBeforeCellRender: args => {
          if (args.cell.start.getDay() === 14 && args.cell.start.getHours() > 9) {
            args.cell.html = "<h6>ejhik</h6>"
          }
        },
        onEventEdited:args=>{
          console.log("event edit",args);
        }
      
    };

  }

  componentDidMount() {
   
    // load event data
    this.setState({
      startDate: "2021-09-15",
     
        events: [
          {
            id: 1,
            text: "Event 1",
            start: "2021-09-13T10:30:00",
            end: "2021-09-13T13:00:00",
            moveDisabled :true,
            clickDisabled :true,
            resizeDisabled :true,
            deleteDisabled :true,
          },
          {
            id: 2,
            text: "Event 2",
            start: "2021-09-14T09:30:00",
            end: "2021-09-14T11:30:00",
            backColor: "#38761d"
          },
          {
            id: 2,
            text: "Event 3",
            start: "2021-09-14T12:00:00",
            end: "2021-09-14T15:00:00",
            backColor: "#cc4125"
          },
        ]
     
    });
  }

  render() {
    var { ...config } = this.state;
    return (
      <div style={styles.wrap}>
        <div style={styles.left}>
          <DayPilotNavigator
            selectMode={"week"}
            showMonths={3}
            skipMonths={3}
            onTimeRangeSelected={ args => {
              this.setState({
                startDate: args.day
              });
            }}
          />
        </div> 
        <div style={styles.main}>
          <DayPilotCalendar
            {...config}
            ref={component => {
              this.calendar = component && component.control;
            }}

          />
        </div>
        <button onClick={() => { console.log("calender", this.calendar ? this.calendar : "") }}>calender</button>
      </div>
    );
  }
}

export default Calendar;