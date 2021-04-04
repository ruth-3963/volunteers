//import * as React from 'react';
//import * as ReactDOM from 'react-dom';
//import { ScheduleComponent, WorkWeek, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
//import { appData } from './datasource';
//import { extend } from '@syncfusion/ej2-base';
//class WeekCalender extends React.Component {
//    constructor() {
//        super(...arguments);
//        this.data = extend([], appData, null, true);
//        this.workDays = [2, 3, 5];
//    }
//    render() {
//        return <ScheduleComponent width='100%' height='550px' selectedDate={new Date(2018, 1, 15)} eventSettings={{ dataSource: this.data }}>
//      <ViewsDirective>
//        <ViewDirective option='WorkWeek' workDays={this.workDays}/>
//      </ViewsDirective>
//      <Inject services={[WorkWeek]}/>
//    </ScheduleComponent>;
//    }
//}
//export default WeekCalender;