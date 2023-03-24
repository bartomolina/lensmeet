import { PostFragment } from "@lens-protocol/react";
import EventDetails from "./event-details";

interface IEventsByMonth {
  month: number;
  events: PostFragment[];
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

function groupByMonth(events: PostFragment[]) {
  const array = [] as IEventsByYear[];
  events.forEach((event) => {
    const startDate = event.metadata.attributes.find((attribute) => attribute.traitType === "Start date");
    if (startDate && startDate.value) {
      const startDateValue = new Date(parseInt(startDate.value) * 1000);
      const eventYear = startDateValue.getFullYear();
      const eventMonth = startDateValue.getMonth();

      const year = array.find((years: IEventsByYear) => years.year === eventYear);

      if (!year) {
        array.push({ year: eventYear, months: [{ month: eventMonth, events: [event] }] });
      } else {
        const months = year.months;
        const month = months.find((yearEvents: IEventsByMonth) => yearEvents.month === eventMonth);
        if (!month) {
          months.push({ month: eventMonth, events: [event] });
        } else {
          month.events.push(event);
        }
      }
    }
  });
  array.sort((a, b) => a.year - b.year);
  array.map((year) => year.months.sort((a, b) => a.month - b.month));
  return array;
}

type Props = {
  events: PostFragment[];
};

const ProfilesList = ({ events }: Props) => {
  const groupedByMonth = groupByMonth(events);
  console.log(groupedByMonth);

  return (
    <>
      {groupedByMonth.map((year) => (
        <div key={year.year}>
          <h2 className="w-full text-end text-2xl">{year.year}</h2>
          {year.months.map((month) => (
            <div key={month.month}>
              <h3 className="text-xl font-light mt-3 mb-1">{monthNames[month.month]}</h3>
              <ul className="space-y-4">
                {month.events && month.events.map((_event) => <EventDetails key={_event.id} _event={_event} />)}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default ProfilesList;
