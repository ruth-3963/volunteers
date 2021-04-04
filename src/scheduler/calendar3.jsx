
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ScheduleComponent, Day, Week, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { extend, createElement } from '@syncfusion/ej2-base';
import scheduleData  from './datasource';
class Calendar extends React.Component {
    constructor() {
        super(...arguments);
        this.data = extend([], scheduleData, null, true);
    }
    onRenderCell(args) {
        if (args.elementType == 'workCells' || args.elementType == 'monthCells') {
            let weekEnds = [0, 6];
            if (weekEnds.indexOf((args.date).getDay()) >= 0) {
                let ele = createElement('div', {
                    innerHTML: "<img src='https://ej2.syncfusion.com/demos/src/schedule/images/newyear.svg' />",
                    className: 'templatewrap'
                });
                (args.element).appendChild(ele);
            }
        }
    }
    render() {
        return <ScheduleComponent height='550px' currentView='Month' selectedDate={new Date(2018, 1, 15)} eventSettings={{ dataSource: this.data }} renderCell={this.onRenderCell.bind(this)}>
        <ViewsDirective>
          <ViewDirective option='Week'/>
          <ViewDirective option='WorkWeek'/>
          <ViewDirective option='Month'/>
        </ViewsDirective>
        <Inject services={[Day, Week, Month]}/>
      </ScheduleComponent>;
    }
}
export default Calendar;
