import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useState, useContext } from "react";
import { Store } from "../Store";

//props being user, admin, or employee
function UserLoggedIn(props) {
  const loggedInUser = props.loggedInAs.isUser;
  const loggedInEmployee = props.loggedInAs.isEmployee;

  if (loggedInEmployee === "Employee") {
    return (
      <div>
        <LinkContainer to="/employeeAppointments">
          <NavDropdown.Item> Appointments </NavDropdown.Item>
        </LinkContainer>
      </div>
    );
  } else if (loggedInUser === "user") {
    return (
      <div>
        <LinkContainer to="/profile">
          <NavDropdown.Item> User Profile</NavDropdown.Item>
        </LinkContainer>

        <LinkContainer to="/appointments">
          <NavDropdown.Item> Appointments </NavDropdown.Item>
        </LinkContainer>
      </div>
    );
  } else if (loggedInEmployee === "Admin") {
    return (
      <div>
        <LinkContainer to="/employeeAppointments">
          <NavDropdown.Item> Appointments </NavDropdown.Item>
        </LinkContainer>

        <LinkContainer to="/employees">
          <NavDropdown.Item> Employee's </NavDropdown.Item>
        </LinkContainer>
      </div>
    );
  }
}

function UserLoggedInSideBar(props) {
  const loggedInUser = props.loggedInAs.isUser;
  const loggedInEmployee = props.loggedInAs.isEmployee;

  if (loggedInEmployee === "Employee") {
    return (
      <div className="dropdown">
        <Link to="/employeeAppointments" className="link">
          Appointments
        </Link>
      </div>
    );
  } else if (loggedInUser === "user") {
    return (
      <div className="dropdown">
        <Link to="/profile" className="link">
          Profile
        </Link>

        <Link to="/Appointments" className="link">
          Appointments
        </Link>
      </div>
    );
  } else if (loggedInEmployee === "Admin") {
    return (
      <div className="dropdown">
        <Link to="/employeeAppointments" className="link">
          Appointments
        </Link>

        <Link to="/employees" className="link">
          Employee's
        </Link>
      </div>
    );
  }
  if (loggedInUser === null) {
    return <div>hi</div>;
  }
}

export default function NavbarComp(color) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const userInfo = !state.userInfo ? state.employeeInfo : state.userInfo;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [subnav, setSubnav] = useState(false);

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    ctxDispatch({ type: "EMPLOYEE_SIGNOUT" });
    localStorage.removeItem("employeeInfo");
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar bg={color.color} variant="dark">
        <Container
          className={
            sidebarIsOpen
              ? "justify-content-between active-cont"
              : "justify-content-between"
          }
        >
          <LinkContainer to="/">
            <Navbar.Brand className="brand">Home</Navbar.Brand>
          </LinkContainer>

          <div
            className="bars-outline"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            <i
              className={sidebarIsOpen ? "none" : "fas fa-bars sidebar-bars"}
            ></i>
          </div>

          

          {userInfo ? (
            <NavDropdown
              title={userInfo.firstname}
              id="basic-nav-dropdown"
              className="user"
            >
              <UserLoggedIn loggedInAs={userInfo} />

              <NavDropdown.Divider />
              <Link
                className="dropdown-item"
                to="#signout"
                onClick={signoutHandler}
              >
                Sign Out
              </Link>
            </NavDropdown>
          ) : (
            <Link className="nav-link sign-in" to="/signin">
              {" "}
              Sign In{" "}
            </Link>
          )}
        </Container>
      </Navbar>

      <div
        className={
          sidebarIsOpen
            ? "active-nav side-navbar justify-content-between"
            : "side-navbar justify-content-between"
        }
      >
        <Nav className="flex-column text-white">
          <Button variant="" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
            <i
              className={
                !sidebarIsOpen
                  ? "fas fa-chevron-left sidebar-x"
                  : "fas fa-chevron-left sidebar-x"
              }
            ></i>
          </Button>

          <Nav.Item>
            {userInfo ? (
              <p className="item">
                {" "}
                {userInfo.firstname}
                <Button variant="" onClick={() => setSubnav(!subnav)}>
                  <i
                    className={
                      !subnav
                        ? "fas fa-chevron-down submenu-icon"
                        : "fas fa-chevron-up submenu-icon"
                    }
                  ></i>
                </Button>
              </p>
            ) : (
              <Link className="item" to="/signin">
                {" "}
                Sign In{" "}
              </Link>
            )}
          </Nav.Item>

          <Nav.Item>
            <div className={!subnav ? "none" : "dropdown"}>
              <UserLoggedInSideBar loggedInAs={userInfo ? userInfo : ""} />
              <Link className="link" to="#signout" onClick={signoutHandler}>
                Sign Out
              </Link>
            </div>
          </Nav.Item>

          <Nav.Item>
            <Link className="item" to="/">
              Home
            </Link>
          </Nav.Item>

        </Nav>
      </div>
    </div>
  );
}

/*

<Nav className="list">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/service" className="nav-link">
              Service
            </Link>
            <Link to="/gallery" className="nav-link">
              Gallery
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </Nav>
  */