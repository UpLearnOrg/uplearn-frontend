import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";
import { UsersApi } from "../../api/users/users-api";
import NavbarItems from "./NavbarItems";

export type NavbarProps = {
  content: JSX.Element;
};

export default function Navbar({ content }: NavbarProps) {
  const navigate = useNavigate();

  const logout = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    await AuthApi.logout();

    navigate("/login");
  };

  const { data: authenticatedUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: () => UsersApi.getAuthenticatedUser(),
  });

  const closeDrawer = () => {
    const el = document.getElementById("my-drawer");

    if (el !== null) el.click();
  };

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="navbar bg-base-200">
            <div className="flex-none">
              <label
                className="btn btn-square btn-ghost drawer-button"
                htmlFor="my-drawer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link
                className="btn btn-ghost normal-case text-xl"
                to={
                  AuthApi.isEmployee()
                    ? "/dashboard/my-timetable"
                    : "/dashboard"
                }
              >
                UpLearn
              </Link>
            </div>
            <div className="flex-none mr-4">
              <Link to="/dashboard/settings">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-10 cursor-pointer">
                    <span className="text-md">
                      {authenticatedUser
                        ? authenticatedUser?.data?.name[0] +
                          authenticatedUser?.data?.surname[0]
                        : ""}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="desktop:p-10 p-3 py-10">{content}</div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 bg-base-200 text-base-content flex flex-col">
            <li className="grow" onClick={closeDrawer}>
              <NavbarItems />
            </li>
            <button className="btn btn-outline btn-error" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
