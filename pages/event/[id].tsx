import Link from "next/link";
import { useRouter } from "next/router";

const Event = () => {
  const router = useRouter();

  return (
    <>
      <Link
        href={"/newSideEvent"}
        className={`border rounded-md px-3 py-1 bg-opacity-20 border-lime-500 text-lime-900 bg-lime-50 hover:bg-lime-100`}
      >
        Create side event
      </Link>
    </>
  );
};

export default Event;
