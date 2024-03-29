import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AuthApi } from "../../api/auth/auth-api";
import { EventInterface, EventsApi } from "../../api/events/events-api";
import { LessonsApi } from "../../api/lessons/lessons-api";
import { SchoolHoursApi } from "../../api/school-hours/school-hours-api";
import {
  SchoolHourInterface,
  toFormattedDate,
} from "../../pages/dashboard/admin/ManageSchoolHours";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import AddEventModal from "../modals/events/AddEventModal";
import TimetableClassSelection from "./TimetableClassSelection";
import TimetableEvent from "./TimetableEvent";
import TimetableLesson, { TimetableLessonProps } from "./TimetableLesson";
import TimetableWeekPicker from "./TimetableWeekPicker";

export type TimetableProps = {
  classNameP?: string;
};

export default function Timetable({ classNameP }: TimetableProps) {
  const [className, setClassName] = useState<string>(classNameP ?? "");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [addEventModalActive, setAddEventModalActive] = useState(false);

  const { status: schoolHoursStatus, data: schoolHours } = useQuery({
    queryKey: ["schoolHours"],
    queryFn: SchoolHoursApi.getAll,
  });

  const {
    status: lessonsStatus,
    data: lessons,
    refetch: refetchLessons,
  } = useQuery(
    ["lessons", className, startDate, endDate],
    () =>
      LessonsApi.getLessonsByClassAndDateRange(
        className ?? "",
        moment(startDate).subtract(1, "d").toDate().toISOString() ?? "",
        moment(endDate).add(1, "d").toDate().toISOString() ?? ""
      ),
    {
      enabled: checkStatesInitialized(
        classNameP ?? className,
        startDate,
        endDate
      ),
    }
  );

  const {
    status: eventsStatus,
    data: events,
    refetch: refetchEvents,
  } = useQuery(
    ["events", className, startDate, endDate, addEventModalActive],
    () =>
      EventsApi.getEventsByClassAndDateRange(
        className ?? "",
        moment(startDate).subtract(1, "d").toDate().toISOString() ?? "",
        moment(endDate).add(1, "d").toDate().toISOString() ?? ""
      ),
    {
      enabled: checkStatesInitialized(
        classNameP ?? className,
        startDate,
        endDate
      ),
    }
  );

  if (schoolHoursStatus === "loading") return <Loader active={true} />;
  if (
    schoolHoursStatus === "error" ||
    lessonsStatus === "error" ||
    eventsStatus === "error"
  )
    return <ErrorAlert msg={"Page couldn't load"} />;

  const setNewWeek = (stDate: Date, enDate: Date) => {
    setStartDate(stDate);
    setEndDate(enDate);
  };

  const getTimetableLessonProps = (schoolHourId: string, dayOfWeek: number) => {
    let props: Omit<
      TimetableLessonProps,
      "schoolHourId" | "date" | "onClose"
    >[] = [];

    let result = lessons?.data.filter(
      (item: { schoolHourId: string; date: string }) =>
        item.schoolHourId === schoolHourId &&
        item.date.split("T")[0] ===
          moment(startDate)
            .add(dayOfWeek, "d")
            .toDate()
            .toISOString()
            .split("T")[0]
    );

    if (result) {
      result.forEach((res: any, i: number) => {
        const timetableLessonProp: Omit<
          TimetableLessonProps,
          "schoolHourId" | "date" | "onClose"
        > = {
          teacher: "",
          className,
          lessonId: "",
          type: "",
          classroom: "",
          subject: "",
        };

        if (res.type === "SUBSTITUTE") {
          const teacher = res.substituteEmployee.user;

          timetableLessonProp.teacher = teacher.name + " " + teacher.surname;
        } else {
          const teacher = res.employee_Subject.employee.user;

          timetableLessonProp.teacher = teacher.name + " " + teacher.surname;
        }

        timetableLessonProp.subject = res.subjectAbbreviation;
        timetableLessonProp.classroom = res.classroomName;
        timetableLessonProp.type = res.type;
        timetableLessonProp.lessonId = res.id;

        props.push(timetableLessonProp);
      });
    }

    return props;
  };

  interface EventListInterface {
    dayOfWeek: number;
  }

  function EventList({ dayOfWeek }: EventListInterface) {
    let result = events?.data.filter(
      (event: EventInterface) =>
        event.date.split("T")[0] ===
        moment(startDate)
          .add(dayOfWeek, "d")
          .toDate()
          .toISOString()
          .split("T")[0]
    );

    if (!result) return <></>;

    return (
      <>
        <div className="flex flex-col">
          {result.map((event: EventInterface, index: number) => (
            <TimetableEvent key={index} event={event} onClose={refetchEvents} />
          ))}
        </div>
      </>
    );
  }

  function getSchoolHourLessons(schoolHourId: string) {
    const lessons: JSX.Element[] = [];

    for (let i = 0; i < 5; i++) {
      const timetableProps = getTimetableLessonProps(schoolHourId, i);

      if (timetableProps.length === 0) {
        lessons.push(
          <td className="p-0 border-r-[1px] border-zinc-700" key={i}>
            <TimetableLesson
              className={className}
              lessonId=""
              type=""
              classroom=""
              subject=""
              teacher=""
              schoolHourId={schoolHourId}
              date={moment(startDate).add(i, "d").toDate().toISOString()}
              onClose={() => refetchLessons()}
            />
          </td>
        );

        continue;
      }

      lessons.push(
        <td className="p-0 border-r-[1px] border-zinc-700" key={i}>
          {timetableProps.map((props, index) => (
            <TimetableLesson
              {...props}
              key={index}
              schoolHourId={schoolHourId}
              date={moment(startDate).add(i, "d").toDate().toISOString()}
              onClose={() => refetchLessons()}
            />
          ))}
        </td>
      );
    }

    return lessons;
  }

  return (
    <>
      <Loader active={lessonsStatus === "loading" && className !== ""} />
      <AddEventModal
        active={addEventModalActive}
        onActiveChange={(active) => {
          setAddEventModalActive(active);
          // refetchEvents();
        }}
      />
      {!classNameP && !AuthApi.isStudent() ? (
        !AuthApi.isAdmin() ? (
          <TimetableClassSelection
            active={true}
            onSelection={(cName) => setClassName(cName)}
          />
        ) : (
          <div className="flex desktop:flex-row flex-col desktop:items-center">
            <div className="desktop:flex-1">
              <TimetableClassSelection
                active={true}
                onSelection={(cName) => setClassName(cName)}
              />
            </div>
            <div className="desktop:flex-1 items-end mb-5">
              <button
                className="btn btn-primary desktop:float-right"
                onClick={() => setAddEventModalActive(true)}
              >
                <FontAwesomeIcon icon={faPlus} size="lg" />
                <span className="ml-3">Add Event</span>
              </button>
            </div>
          </div>
        )
      ) : (
        <></>
      )}
      <TimetableWeekPicker
        onSelection={(startDate, endDate) => setNewWeek(startDate, endDate)}
      />
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <td>
                <div className="w-1/6"></div>
              </td>
              <th>
                <TimetableHeader
                  dayNum={0}
                  dayName={"Monday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={1}
                  dayName={"Tuesday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={2}
                  dayName={"Wednesday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={3}
                  dayName={"Thursday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={4}
                  dayName={"Friday"}
                  startDate={startDate}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-0">
              <td className="border-r-[1px] border-zinc-700">Events</td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={0} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={1} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={2} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={3} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={4} />
              </td>
            </tr>
            {schoolHours?.data.map(
              (schoolHour: SchoolHourInterface, index: number) => (
                <tr key={index}>
                  <td className="border-r-[1px] border-zinc-700">
                    <div className="flex flex-col">
                      <span className="mb-2">{index + 1 + ". lesson"}</span>
                      <span>
                        {toFormattedDate(schoolHour.startTime) +
                          "-" +
                          toFormattedDate(schoolHour.endTime)}
                      </span>
                    </div>
                  </td>
                  {getSchoolHourLessons(schoolHour.id)}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

interface TimetableHeaderProps {
  dayNum: number;
  dayName: string;
  startDate: Date | undefined;
}

function TimetableHeader({ dayName, startDate, dayNum }: TimetableHeaderProps) {
  const [date, setDate] = useState(moment(startDate).add(dayNum, "d").toDate());

  useEffect(() => {
    setDate(moment(startDate).add(dayNum, "d").toDate());
  }, [dayNum, startDate]);

  if (startDate === undefined) return <span>{dayName}</span>;

  return (
    <>
      <div
        className={
          moment(new Date()).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD")
            ? "text-info"
            : ""
        }
      >
        <div className="flex flex-col w-1/6">
          <span>{`${dayName} `}</span>
          <span>{`${date?.getDate()}. ${
            date?.getMonth() !== undefined ? date?.getMonth() + 1 : ""
          }`}</span>
        </div>
      </div>
    </>
  );
}

const checkStatesInitialized = (
  className: string,
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  const state =
    className === "" ||
    className === undefined ||
    startDate === undefined ||
    endDate === undefined
      ? false
      : true;

  return state;
};
