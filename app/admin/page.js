"use client";

import Link from "next/link";
import { IconLock } from "../../components/icons";

export default function AdminMoved() {
  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="glass rounded-[2.5rem] p-10">
        <div className="flex justify-center">
          <IconLock size={48} className="icon-3d" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Restricted area</h1>
        <p className="mt-2 text-mist text-sm">
          The admin panel has moved to a private URL. Contact the site owner.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block btn-gradient text-white font-bold px-6 py-3 rounded-full hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
