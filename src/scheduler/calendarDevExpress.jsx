import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    WeekView,
    EditRecurrenceMenu,
    AllDayPanel,
    ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import { appointments } from '../demo-data/appointments';
import { makeStyles } from '@material-ui/core/styles';

import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({
    todayCell: {
        backgroundColor: fade(theme.palette.primary.main, 0.1),
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.main, 0.14),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.primary.main, 0.16),
        },
    },
    weekendCell: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
    },
    today: {
        backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
    weekend: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
    },
}));
const TimeTableCell = (props) => {
    const classes = useStyles();
    const { startDate } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
        return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
    } if (date.getDay() === 0 || date.getDay() === 6) {
        return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
    } return <WeekView.TimeTableCell {...props} />;
};
const DayScaleCell = (props) => {
    const classes = useStyles();
    const { startDate, today } = props;

    if (today) {
        return <WeekView.DayScaleCell {...props} className={classes.today} />;
    } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
    } return <WeekView.DayScaleCell {...props} />;
};
export default class Demo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: appointments,
            currentDate: '2018-06-27',

            addedAppointment: {},
            appointmentChanges: {},
            editingAppointment: undefined,
        };

        this.commitChanges = this.commitChanges.bind(this);
        this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
        this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
        this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
    }
    
    changeAddedAppointment(addedAppointment) {
        this.setState({ addedAppointment });
    }

    changeAppointmentChanges(appointmentChanges) {
        this.setState({ appointmentChanges });
    }

    changeEditingAppointment(editingAppointment) {
        this.setState({ editingAppointment });
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
            }
            return { data };
        });
    }

    render() {
        const {
            currentDate, data, addedAppointment, appointmentChanges, editingAppointment,
        } = this.state;

        return (
            <Paper>
                <Scheduler
                    data={data}
                    height={660}
                >
                    <ViewState
                        currentDate={currentDate}
                    />
                    <EditingState
                        onCommitChanges={this.commitChanges}

                        addedAppointment={addedAppointment}
                        onAddedAppointmentChange={this.changeAddedAppointment}

                        appointmentChanges={appointmentChanges}
                        onAppointmentChangesChange={this.changeAppointmentChanges}

                        editingAppointment={editingAppointment}
                        onEditingAppointmentChange={this.changeEditingAppointment}
                    />
                    <WeekView
                        startDayHour={9}
                        endDayHour={17}
                        timeTableCellComponent={TimeTableCell}
                        dayScaleCellComponent={DayScaleCell}

                    />
                    <AllDayPanel />
                    <EditRecurrenceMenu

                     />
                    <ConfirmationDialog />
                    <Appointments />
                    <AppointmentTooltip
                        showOpenButton
                        showDeleteButton
                    />
                    <AppointmentForm />
                </Scheduler>
            </Paper>
        );
    }
}
