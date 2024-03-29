import { faAdd, faDoorOpen, faScroll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { AuthApi } from "../../api/auth/auth-api";
import AddEmployeeLessonModal from "../modals/lessons/AddEmployeeLessonModal";
import LessonInfoModal from "../modals/lessons/LessonInfoModal";

export interface EmployeeTimetableLessonProps {
  subject?: string;
  teacher?: string;
  classroom?: string;
  schoolHourId: string;
  date: string;
  employeeId: string;
  type: string;
  lessonId: string;
  onClose: () => any;
}

export default function EmployeeTimetableLesson({
  subject,
  teacher,
  classroom,
  schoolHourId,
  date,
  type,
  employeeId,
  lessonId,
  onClose,
}: EmployeeTimetableLessonProps) {
  const [addLessonModalActive, setAddLessonModalActive] = useState(false);
  const [lessonInfoModalActive, setLessonInfoModalActive] = useState(false);
  const [showAddIcon, setShowAddIcon] = useState(false);

  return (
    <>
      {addLessonModalActive && !AuthApi.isStudent() ? (
        <AddEmployeeLessonModal
          active={addLessonModalActive}
          onActiveChange={(active) => {
            setAddLessonModalActive(active);
            onClose();
          }}
          schoolHourId={schoolHourId}
          date={date}
          employeeId={employeeId}
        />
      ) : (
        <></>
      )}
      {lessonInfoModalActive ? (
        <LessonInfoModal
          active={lessonInfoModalActive}
          onActiveChange={(active) => {
            setLessonInfoModalActive(active);
            onClose();
          }}
          lessonId={lessonId}
        />
      ) : (
        <></>
      )}
      <div
        className={
          AuthApi.isStudent() && !teacher
            ? "min-w-[10rem] rounded-md cursor-pointer p-4"
            : "min-w-[10rem] hover:bg-primary rounded-md cursor-pointer p-4"
        }
        onClick={() => {
          if (subject === undefined || subject === "")
            setAddLessonModalActive(true);
          else setLessonInfoModalActive(true);
        }}
        onMouseEnter={() => setShowAddIcon(classroom === "" ? true : false)}
        onMouseLeave={() => setShowAddIcon(false)}
      >
        {!showAddIcon || AuthApi.isStudent() ? (
          <></>
        ) : (
          <FontAwesomeIcon
            icon={faAdd}
            className="relative top-1/2 left-1/2 -translate-x-1/2"
          />
        )}
        {classroom === "" ? (
          <></>
        ) : (
          <>
            <div className="block w-full">
              <span className="font-bold mr-8">
                {type === "SUBSTITUTE" ? "Substitute" : subject}
              </span>
              {type === "GRADING" ? (
                <span className="text-info float-right">
                  <FontAwesomeIcon icon={faScroll} />
                </span>
              ) : (
                <></>
              )}
            </div>
            <span className="mb-4 font-thin block">{teacher}</span>
            <div className="block">
              <FontAwesomeIcon icon={faDoorOpen} />
              <span className="ml-3">{classroom}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
