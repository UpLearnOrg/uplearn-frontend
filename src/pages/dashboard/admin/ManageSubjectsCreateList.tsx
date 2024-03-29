import React, { useRef, useState } from "react";
import makeAnimated from "react-select/animated";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { SubjectsApi } from "../../../api/subjects/subjects-api";
import Loader from "../../../components/Loader";
import { SubjectListsApi } from "../../../api/subjects/subject-listst-api";
import { style } from "../../../components/ReactSelectStyle";
import PageOutline from "../../../components/pages/PageOutline";

let options: { value: string; label: string }[] = [];
const animatedComponents = makeAnimated();

export default function ManageSubjectsCreateList() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const name = useRef<HTMLInputElement>(null);

  const handleSelectedSubjectChange = (selected: any) => {
    setSelectedSubjects(selected);
  };

  const { status: subjectStatus, data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: SubjectsApi.getAll,
  });

  if (subjectStatus === "loading") return <Loader active={true} />;
  if (subjectStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  options = [];

  subjects?.data.forEach((subject: { abbreviation: string }) => {
    options.push({
      value: subject.abbreviation,
      label: `${subject.abbreviation}`,
    });
  });

  const createSubjectList = async () => {
    setError("");
    setSuccess("");

    if (name.current && name.current.value === "") {
      setError("You need to povide a name for the subject list");
      return;
    }

    if (selectedSubjects.length === 0) {
      setError("You need to select some subjects for the subject list");
      return;
    }

    const data = {
      name: name.current === null ? "" : name.current.value,
      subjects: selectedSubjects,
    };

    setLoading(true);

    const subjectList = await SubjectListsApi.create(data)
      .catch((e) => {
        setError(e.response.data.cause);
      })
      .finally(() => {
        setLoading(false);
      });

    if (!subjectList) {
      if (error === "") setError("Something went wrong please try again later");
      return;
    }

    setSuccess("New subject list has been created");
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <PageOutline
        title="Create Subject List"
        navigationElements={[
          { title: "View subjects", link: "/dashboard/manage-subjects" },
          {
            title: "Create subject",
            link: "/dashboard/manage-subjects/create",
          },
          {
            title: "View subject lists",
            link: "/dashboard/manage-subjects/lists",
          },
          {
            title: "Create subject list",
            link: "/dashboard/manage-subjects/create-list",
          },
        ]}
      >
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Name:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            ref={name}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Subjects:</span>
          </label>
          <Select
            options={options}
            isMulti
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={handleSelectedSubjectChange}
            styles={style}
          />
        </div>

        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={createSubjectList}
        >
          Create Subject List
        </button>
      </PageOutline>
    </>
  );
}
