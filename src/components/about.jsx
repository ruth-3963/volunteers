
export const About = () => {
    return (
        <div className="about">
            <h1>useful and comf volunteers system</h1>
            <h3>Our goal is to enable any group of volunteers
                <br /> Who want to volunteer for someone to do it efficiently and conveniently<br /><br />
                <u>So how get started?</u></h3>
            <h4>The first stage is : <u>Volunteers</u>, Is there? Excellent,We can continue ...</h4>
            <h5>
                Now you need to deciede which volunteer will be the manager,
                The selected user need to open the group.
            </h5>
           <br/> <h4>How to create a group ? </h4>
            <h5>If you already register you have to options :
                <b>1. </b> <a href="/createGroup">enter to this link </a>
                <b>   2. </b> In profile page.<br/>
                else <a href = "/signin">register </a>and after you type email and password 
                you can choose group , to create group choose <u>create new group </u>option<br/></h5>
           <br/> <h4>You created group ? Beutifull , we can continue...</h4>
            <h5>In the top bar you have <u>Edit schedule </u>and <u>Add volunteers</u> options (only if you are the manager)</h5>
            <br/><h4>Edit Schedule page</h4>
            <h5><b>In this page you create all shifts are consumed,
            now you have some options</b> <br/>
            <b>1.Save : </b>The shifts save in the system <br/>
            <b>2.Save and request inlay : </b>Automatic email will send to all volunteer with request to choose shifts that they can to volunteer
            (in the next lines we explain how do it)<br/>
            <b>3.Save and send : </b>After all the shifts is full the manager clicking on this button and email with message 
            that schedule ready will send</h5>
            <br/><h4>So - What is the way that volunteers choose shifts</h4>
            <h5>After all the hours of shifts is ready, the volunteer enter to choose shifts screen<br/>
            and choose all shifts that they can to volunteer<br/>
            <i><b>Pay Attention : </b>volunteer choose all shifts that he can and the manager distributes the shifts evenly</i><br/>
            <br/><h4>Now its the role of manager to inlay the shifts</h4>
                in edit shedule screen double click on shifts and in volunteer field the manager get all users that agree to volunteer
                in this shifts and he choose on of them <br/>
                In the top of shedule there is <u>calc shifts</u> button <br/>
                the role of this button is to do  automatic inlay
                (of cours the manager can to keep changes after automatic inlay)<br/>
            </h5>
<h3>Thank you for your donor We wish you much success</h3>

        </div>
    );
}

