import {
  faBook,
  faCalendar,
  faChalkboardTeacher,
  faChartSimple,
  faClock,
  faDoorOpen,
  faUsers,
  faUsersRectangle,
  faUserXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";

export default function NavbarItems() {
  if (AuthApi.isAdmin()) {
    return (
      <>
        <Link to={"/dashboard"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faCalendar} size="lg" />
          </span>
          <span className="base-5/6">Timetable</span>
        </Link>
        <Link to={"/dashboard/manage-classes"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faUsersRectangle} size="lg" />
          </span>
          <span className="base-5/6">Classes</span>
        </Link>
        <Link to={"/dashboard/manage-subjects"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" />
          </span>
          <span className="base-5/6">Subjects</span>
        </Link>
        <Link to={"/dashboard/manage-users"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faUsers} size="lg" />
          </span>
          <span className="base-5/6">Users</span>
        </Link>
        <Link to={"/dashboard/manage-grades"} className="flex">
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faBook} size="lg" />
          </span>
          <span className="base-5/6">Gradebook</span>
        </Link>
        <Link to={"/dashboard/employee-performance"} className="flex">
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faChartSimple} size="lg" />
          </span>
          <span className="base-5/6">Employee Performance</span>
        </Link>
        <Link to={"/dashboard/manage-absences"} className="flex">
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faUserXmark} size="lg" />
          </span>
          <span className="base-5/6">Absences</span>
        </Link>
        <Link to={"/dashboard/manage-classrooms"} className="flex">
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faDoorOpen} size="lg" />
          </span>
          <span className="base-5/6">Classrooms</span>
        </Link>
        <Link to={"/dashboard/manage-school-hours"} className="flex">
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faClock} size="lg" />
          </span>
          <span className="base-5/6">School Hours</span>
        </Link>
      </>
    );
  } else if (AuthApi.isStudent()) {
    return (
      <>
        <Link to={"/dashboard"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faCalendar} size="lg" />
          </span>
          <span className="base-5/6">Timetable</span>
        </Link>
        <Link to={"/dashboard/my-grades"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faBook} size="lg" />
          </span>
          <span className="base-5/6">Grades</span>
        </Link>
        <Link to={"/dashboard/absences"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faUserXmark} size="lg" />
          </span>
          <span className="base-5/6">Absences</span>
        </Link>
        <Link to={"/dashboard/upcoming-gradings"}>Upcoming Gradings</Link>
        <Link to={"/dashboard/upcoming-events"}>Upcoming Events</Link>
        <Link to={"/dashboard/grade-employees"}>Grade Employees</Link>
      </>
    );
  } else if (AuthApi.isEmployee()) {
    return (
      <>
        <Link to={"/dashboard/my-timetable"}>My Timetable</Link>
        <Link to={"/dashboard"}>All Timetables</Link>
        <Link to={"/dashboard/manage-grades"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faBook} size="lg" />
          </span>
          <span className="base-5/6">Gradebook</span>
        </Link>
        <Link to={"/dashboard/manage-absences"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faUserXmark} size="lg" />
          </span>
          <span className="base-5/6">Absences</span>
        </Link>
        <Link to={"/dashboard/my-performance"}>
          <span className="base-1/6 text-left mr-3 w-5">
            <FontAwesomeIcon icon={faChartSimple} size="lg" />
          </span>
          <span className="base-5/6">My Performance</span>
        </Link>
      </>
    );
  }

  return <Navigate to={"/login"} />;
}
