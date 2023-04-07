import Image from "next/image";

const Lists = () => (
  <ul className="pt-24">
    <li className="w-56 h-20 relative">
      <Image
        src="https://ik.imagekit.io/3dn0rxeyb/cryptoplaza_GVeunre4e.png"
        alt="CryptoPlaza"
        fill
        sizes="(max-width: 230px) 100vw"
        className="object-cover"
      />
    </li>
  </ul>
);

export default Lists;
