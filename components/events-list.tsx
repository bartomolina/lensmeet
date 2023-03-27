import { IEvent } from "../global";
import { PostFragment } from "@lens-protocol/react";
import EventDetails from "./event-details";

interface IEventsByMonth {
  month: number;
  events: IEvent[];
}

interface IEventsByYear {
  year: number;
  months: IEventsByMonth[];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function groupByMonth(events: IEvent[]) {
  const array = [] as IEventsByYear[];
  events.forEach((e) => {
    const startDate = e._event.metadata.attributes.find((attribute) => attribute.traitType === "Start date");
    if (startDate && startDate.value) {
      const startDateValue = new Date(parseInt(startDate.value) * 1000);
      const eventYear = startDateValue.getFullYear();
      const eventMonth = startDateValue.getMonth();

      const year = array.find((years: IEventsByYear) => years.year === eventYear);

      if (!year) {
        array.push({ year: eventYear, months: [{ month: eventMonth, events: [e] }] });
      } else {
        const months = year.months;
        const month = months.find((yearEvents: IEventsByMonth) => yearEvents.month === eventMonth);
        if (!month) {
          months.push({ month: eventMonth, events: [e] });
        } else {
          month.events.push(e);
        }
      }
    }
  });
  array.sort((a, b) => a.year - b.year);
  array.map((year) => year.months.sort((a, b) => a.month - b.month));
  return array;
}

type Props = {
  events: IEvent[];
};

const ProfilesList = ({ events }: Props) => {
  const groupedByMonth = groupByMonth(events);

  return (
    <>
      {groupedByMonth.map((year) => (
        <div key={year.year}>
          <h2 className="w-full text-end px-2 text-2xl text-gray-600">{year.year}</h2>
          {year.months.map((month) => (
            <div key={month.month}>
              <h3 className="text-xl text-lime-900 font-medium p-2 mt-6 rounded-md bg-lime-50">{monthNames[month.month]}</h3>
              <ul className="space-y-2">
                {month.events &&
                  month.events.map((_event) => (
                    <EventDetails
                      key={_event._event.id}
                      _event={_event}
                    />
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default ProfilesList;
