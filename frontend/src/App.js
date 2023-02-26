import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppointmentScreen from "./screens/AppointmentScreen";
import HomeScreen from "./screens/HomeScreen";
import PaymentScreen from "./screens/PaymentScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import EmployeeSigninScreen from "./screens/EmployeeSigninScreen";
import EmployeesScreen from "./screens/EmployeesScreen";
import CreateEmployeeScreen from "./screens/CreateEmployeeScreen";
import UpdateEmployeeScreen from "./screens/UpdateEmployeeScreen";
import EmployeeAppointmentScreen from "./screens/EmployeeAppointmentScreen"
import EmployeeForgotPasswordScreen from "./screens/EmployeeForgotPasswordScreen";
import ResetEmployeePasswordScreen from "./screens/ResetEmployeePasswordScreen"


function App() {
  return (
    <div>
    <BrowserRouter>
    <ToastContainer position="bottom-center" autoClose={1000}/>
      <div>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/paymentScreen/:id" element={<PaymentScreen />} />
            <Route path="/appointments" element={<AppointmentScreen />} />
            <Route path="/employeeSignin" element={<EmployeeSigninScreen />} />
            <Route path="/employeeForgotPassword" element={<EmployeeForgotPasswordScreen />} />
            <Route path="/resetEmployeePassword/:token" element={<ResetEmployeePasswordScreen />}/>
            <Route path="/employees" element={<EmployeesScreen />} />
            <Route path="/updateEmployee/:id" element={<UpdateEmployeeScreen />} />
            <Route path="/createEmployee" element={<CreateEmployeeScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/forgotPassword" element={<ForgotPasswordScreen />}/>
            <Route path="/resetPassword/:token" element={<ResetPasswordScreen />}/>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/employeeAppointments" element={<EmployeeAppointmentScreen />}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>

    </div>
  );
}

export default App;

//autoClose={1000}