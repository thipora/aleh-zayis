


// import Login from "./components/Login";

// function App() {
//   return <Login onLogin={(email, password) => console.log(email, password)} />;
// }

// export default App;

import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import EmployeeRegister from "./components/EmployeeRegister";
// import {Login} from "./components/Login";

function App() {
  return <EmployeeRegister />;
  // return (
  //   <>
  //     <Router>
  //       <Routes>
  //         {/* <Route path="/" element={<Home />} />
  //         <Route path="/Home" element={<Home />} />
  //         <Route path="businesses">
  //           <Route index element={<Businesses />} />
  //           <Route path=':idBusiness' element={<Business />} />
  //           <Route path='register' element={<BusinessRegister />} />
  //           <Route path='login' element={<BusinessLogin />} />
  //           <Route path='personal-area' element={<PersonalArea />} />
  //         </Route> */}



  //         <Route path="/employeeRegister" element={<EmployeeRegister />} />
  //         <Route path="/" element={<EmployeeRegister />} />

  //         {/* <Route path="/login" element={<Login />} /> */}
  //       </Routes>
  //     </Router>
  //   </>
  // )

}

export default App;
