import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { UsersApi } from "../../api/users/users-api";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import SuccessAlert from "../../components/alerts/SuccessAlert";
import Loader from "../../components/Loader";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gsm, setGsm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCurrentPasswordChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    setCurrentPassword(target.value);
  };

  const handleNewPasswordChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    setNewPassword(target.value);
  };

  const handleUsernameChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    setUsername(target.value);
  };

  const handleEmailChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    setEmail(target.value);
  };

  const handleGsmChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    setGsm(target.value);
  };

  const updateUserBasicInfo = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    let payload = {
      username,
      password: newPassword,
    };

    let k: keyof typeof payload;
    for (k in payload) {
      if (payload[k] === "") delete payload[k];
    }

    const update = await UsersApi.upateAuthenticatedUser({
      ...payload,
      currentPassword,
    })
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .then(() => {
        setSuccess("Update successful");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateUserContactInfo = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    let payload = {
      email,
      gsm,
    };

    let k: keyof typeof payload;
    for (k in payload) {
      if (payload[k] === "") delete payload[k];
    }

    const update = await UsersApi.upateAuthenticatedUser({
      ...payload,
    })
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .then(() => {
        setSuccess("Update successful");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { data: authenticatedUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: () => UsersApi.getAuthenticatedUser(),
  });

  useEffect(() => {
    if (authenticatedUser) {
      setUsername(authenticatedUser?.data.username);
      setEmail(authenticatedUser?.data.email);
      setGsm(authenticatedUser?.data.gsm);
    }
  }, [authenticatedUser]);

  return (
    <>
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Loader active={loading} />
      <div className="flex flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Basic info</h1>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Username:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full "
              onChange={handleUsernameChange}
              value={username}
            />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Current password:</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full "
              onChange={handleCurrentPasswordChange}
              value={currentPassword}
            />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">New password:</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full "
              onChange={handleNewPasswordChange}
              value={newPassword}
            />
          </div>
          <button className="btn btn-primary" onClick={updateUserBasicInfo}>
            Save
          </button>
        </div>
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl">
          <h1 className="text-xl font-bold mb-5">Contact info</h1>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full "
              onChange={handleEmailChange}
              value={email === null ? "" : email}
            />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">GSM:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full "
              onChange={handleGsmChange}
              value={gsm === null ? "" : gsm}
            />
          </div>
          <button className="btn btn-primary" onClick={updateUserContactInfo}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
