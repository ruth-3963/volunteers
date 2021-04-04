import React, {Component} from 'react';
import {DayPilot, DayPilotScheduler} from "daypilot-pro-react";
import {SchedulerRow} from './SchedulerRow';

class Scheduler extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timeHeaders: [ {"groupBy": "Week", "format": "d"}],
      scale: "Day",
      days: 61,
      startDate: "2021-08-01",
      timeRangeSelectedHandling: "Enabled",
      rowHeaderWidth: 100,
      onTimeRangeSelected: function (args) {
        var dp = this;
        DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function (modal) {
          dp.clearSelection();
          if (!modal.result) {
            return;
          }
          dp.events.add({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            resource: args.resource,
            text: modal.result
          });
        });
      },
      treeEnabled: true,
      onBeforeRowHeaderRender: function (args) {
        args.row.areas = [
          {
            right: 3,
            top: 3,
            height: 12,
            width: 12,
            icon: "icon-info",
            style: "cursor: pointer",
            onClick: function (args) {
              var row = args.source;
              DayPilot.Modal.alert(row.name);
            }
          }
        ]
      },
      onBeforeRowHeaderDomAdd: function (args) {
        args.target = "Cell";
        args.element = <SchedulerRow row={args.row}/>;
      },
    };
  }

  componentDidMount() {

    // load resource and event data
    this.setState({
      resources: [
        {name: "Resource A", id: "A"},
        {name: "Resource B", id: "B"},
        {name: "Resource C", id: "C"},
        {name: "Resource D", id: "D"},
        {name: "Resource E", id: "E"},
        {name: "Resource F", id: "F"},
        {name: "Resource G", id: "G"}
      ],
      events: [
        {
          id: 1,
          text: "Event 1",
          start: "2021-08-02T00:00:00",
          end: "2021-08-05T00:00:00",
          resource: "A"
        },
        {
          id: 2,
          text: "Event 2",
          start: "2021-08-03T00:00:00",
          end: "2021-08-10T00:00:00",
          resource: "C",
          barColor: "#38761d",
          barBackColor: "#93c47d"
        },
        {
          id: 3,
          text: "Event 3",
          start: "2021-08-02T00:00:00",
          end: "2021-08-08T00:00:00",
          resource: "D",
          barColor: "#f1c232",
          barBackColor: "#f1c232"
        },
        {
          id: 4,
          text: "Event 3",
          start: "2021-08-02T00:00:00",
          end: "2021-08-08T00:00:00",
          resource: "E",
          barColor: "#cc0000",
          barBackColor: "#ea9999"
        }
      ]
    });

    window["dp"] = this.scheduler;

  }

  render() {
    var {...config} = this.state;
    return (
      <div>
        <DayPilotScheduler
          {...config}
          ref={component => {
            this.scheduler = component && component.control;
          }}
        />
      </div>
    );
  }
}

export default Scheduler;
