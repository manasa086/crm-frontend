
import './App.css';
import Home from './Home';
import {Switch,Route} from "react-router-dom";
import Login from "./Login";
import SignUp from './SignUp';
import Email from "./Email";
import ForgotPassword from './ForgotPassword';
import AdminPage from './AdminPage';
import Leads from './Leads';
import LeadsHome from './LeadsHome';
import Contact from './Contact';
import ContactsHome from './ContactsHome';
import Service from './Service';
import ServiceRequestHome from './ServiceRequestHome';
import EmployeeWithOutRights from './EmployeeWithOutRights';
import EmployeeWithOutRightsContactsHome from './EmployeeWithOutRightsContactsHome';
import EmployeeWithOutRightsServiceRequesthome from './EmployeeWithOutRightsServiceRequesthome';

function App() {
  return (

    <div className="App">
      <Switch>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/signup">
          <SignUp></SignUp>
        </Route>
        <Route path="/Email">
          <Email></Email>
        </Route>
        <Route path="/forgotpassword">
          <ForgotPassword></ForgotPassword>
        </Route>
        <Route path="/AdminPage">
          <AdminPage></AdminPage>
        </Route>
        <Route path="/contacts">
         <Contact></Contact>
        </Route>
        <Route path="/leads">
         <Leads></Leads>
        </Route>
        <Route path="/leadshome">
         <LeadsHome></LeadsHome>
        </Route>
        <Route path="/contactshome">
         <ContactsHome></ContactsHome>
        </Route>
        <Route path="/service">
         <Service></Service>
        </Route>
        <Route path="/servicerequesthome">
         <ServiceRequestHome></ServiceRequestHome>
        </Route>
        <Route path="/employeeWithOutRights">
         <EmployeeWithOutRights></EmployeeWithOutRights>
        </Route>
        <Route path="/employeeWithOutRightscontactshome">
          <EmployeeWithOutRightsContactsHome></EmployeeWithOutRightsContactsHome>
        </Route>
        <Route path="/employeeWithOutRightsServiceRequesthome">
          <EmployeeWithOutRightsServiceRequesthome></EmployeeWithOutRightsServiceRequesthome>
        </Route>
        <Route path="/">
          <Home></Home>
        </Route>
     </Switch>
    </div>
  );
}

export default App;
