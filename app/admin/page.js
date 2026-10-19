"use client";

import Link from "next/link";
import { IconLock } from "../../components/icons";

export default function AdminMoved() {
  return (
    <div className="max-w-md mx-auto py-20 text-center relative">
      <div className="ambient-glow w-[24rem] h-[16rem] top-0 left-1/2 -translate-x-1/2" aria-hidden="true" />
      <div className="glass card-warm rounded-[2.5rem] p-10 relative">
        <div className="flex justify-center">
          <IconLock size={48} className="icon-3d" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold page-title">Restricted area</h1>
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
