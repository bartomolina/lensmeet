import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

type Props = {
  list: string;
  setList: Dispatch<SetStateAction<string>>;
};

const Lists = ({ list, setList }: Props) => (
  <>
    <ul className="space-y-4">
      <li className="w-56 h-20 relative">
        <button onClick={(e) => setList("845068988534030337")}>
          <Image
            src="https://ik.imagekit.io/3dn0rxeyb/cryptoplaza_GVeunre4e.png"
            alt="CryptoPlaza"
            fill
            sizes="(max-width: 230px) 100vw"
            className={`object-cover${list != "845068988534030337" ? " opacity-10" : ""}`}
          />
        </button>
      </li>
      <li className="w-56 h-20 relative">
        <button onClick={(e) => setList("818250188205129730")}>
          <Image
            src="https://ik.imagekit.io/3dn0rxeyb/Aave-900x506_zGNSYfnyt.jpeg"
            alt="AAVE"
            fill
            sizes="(max-width: 230px) 100vw"
            className={`object-cover${list != "818250188205129730" ? " opacity-25" : ""}`}
          />
        </button>
      </li>
    </ul>
    <p className="mt-2 text-xs">
      By{" "}
      <a className="hover:underline" href="https://lists.inlens.xyz/" target="_blank" rel="noopener noreferrer">
        Lens Lists
      </a>
    </p>
  </>
);

export default Lists;
