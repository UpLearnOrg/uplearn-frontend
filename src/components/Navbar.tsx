import React, { useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthApi } from "../api/auth/auth-api";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async (e: React.SyntheticEvent) => {
    await AuthApi.logout();

    navigate("/login");
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
                to={"/dashboard"}
              >
                UpLearn
              </Link>
            </div>
            <div className="flex-none mr-4">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10 cursor-pointer">
                  <span className="text-md">TH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
