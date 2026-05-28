"use client";

import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiHome,
  FiLock,
  FiLogIn,
  FiSearch,
  FiShield,
  FiSlash,
} from "react-icons/fi";
import { motion } from "framer-motion";

type HttpErrorPageProps = {
  code: "400" | "401" | "403" | "404";
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
};

export default function HttpErrorPage({
  code,
  title,
  description,
  primaryAction,
}: HttpErrorPageProps) {
  const action = primaryAction ?? {
    label: code === "401" ? "Login" : "Back to Home",
    href: code === "401" ? "/login" : "/home",
  };
  const ActionIcon = code === "401" ? FiLogIn : FiHome;
  const visual = errorVisuals[code];

  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-navy/10 bg-white p-6 text-center shadow-[0_24px_70px_rgba(27,38,59,0.12)] sm:p-10"
      >
        <motion.div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-gold/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
          animate={{ scale: [1, 1.14, 1], opacity: [0.65, 0.95, 0.65] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />

        <ErrorAnimation code={code} />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="relative mt-5 text-xs font-black uppercase tracking-[0.24em] text-slate-400"
        >
          {visual.caption}
        </motion.p>

        <p className="relative mt-4 text-sm font-black uppercase tracking-[0.22em] text-gold">
          Error {code}
        </p>
        <motion.h1
          animate={visual.titleAnimation}
          transition={visual.titleTransition}
          className="relative mt-3 text-4xl font-black text-navy sm:text-6xl"
        >
          {title}
        </motion.h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {description}
        </p>

        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={action.href}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy shadow-gold transition hover:scale-[1.03] hover:brightness-110 active:scale-95"
          >
            <ActionIcon />
            {action.label}
          </Link>
          <Link
            href="/home"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-navy/10 bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-gold/40 hover:text-gold active:scale-95"
          >
            <FiArrowLeft />
            Go to Homepage
          </Link>
        </div>
      </motion.section>
    </main>
  );
}

const errorVisuals = {
  "400": {
    caption: "Request cannot be processed",
    titleAnimation: { x: [0, -4, 4, -2, 2, 0] },
    titleTransition: { duration: 0.7, repeat: Infinity, repeatDelay: 3 },
  },
  "401": {
    caption: "Login session required",
    titleAnimation: { scale: [1, 1.015, 1] },
    titleTransition: { duration: 1.8, repeat: Infinity },
  },
  "403": {
    caption: "Permission gate is closed",
    titleAnimation: { y: [0, -2, 0] },
    titleTransition: { duration: 2, repeat: Infinity },
  },
  "404": {
    caption: "Searching for this page",
    titleAnimation: { opacity: [1, 0.82, 1] },
    titleTransition: { duration: 2.2, repeat: Infinity },
  },
};

function ErrorAnimation({
  code,
}: {
  code: "400" | "401" | "403" | "404";
}) {
  if (code === "400") {
    return (
      <motion.div
        className="relative mx-auto h-28 w-40"
        animate={{ x: [0, -6, 6, -3, 3, 0] }}
        transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 2.5 }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-20 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-danger/25 bg-danger/10"
          animate={{ skewX: [0, -8, 8, 0] }}
          transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 2.5 }}
        >
          <div className="flex h-7 items-center gap-1 border-b border-danger/20 px-3">
            <span className="h-2 w-2 rounded-full bg-danger/50" />
            <span className="h-2 w-2 rounded-full bg-gold/60" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
          <div className="space-y-2 p-3">
            <motion.div
              className="h-2 rounded-full bg-danger/35"
              animate={{ width: ["70%", "38%", "82%", "70%"] }}
              transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 2.5 }}
            />
            <motion.div
              className="h-2 rounded-full bg-slate-300"
              animate={{ width: ["42%", "78%", "36%", "42%"] }}
              transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 2.5 }}
            />
            <div className="flex items-center gap-2 pt-1">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="h-1.5 w-7 rounded-full bg-danger/25"
                  animate={{ y: [0, -4, 4, 0], opacity: [0.55, 1, 0.45, 0.55] }}
                  transition={{
                    duration: 0.65,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    delay: index * 0.08,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
        <motion.span
          className="absolute bottom-2 left-5 rounded-full bg-danger px-2 py-1 text-[10px] font-black text-white shadow-[0_10px_22px_rgba(239,68,68,0.22)]"
          animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, 6] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2.25 }}
        >
          BAD URL
        </motion.span>
        <motion.div
          className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full bg-white text-danger shadow-[0_12px_24px_rgba(239,68,68,0.18)]"
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 2.5 }}
        >
          <FiAlertCircle />
        </motion.div>
      </motion.div>
    );
  }

  if (code === "401") {
    return (
      <div className="relative mx-auto grid h-28 w-28 place-items-center">
        <motion.div
          className="absolute h-24 w-24 rounded-full border border-gold/20"
          animate={{ scale: [1, 1.12, 1], opacity: [0.65, 0.25, 0.65] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-3 h-10 w-12 rounded-t-2xl border-4 border-gold"
          animate={{ y: [0, -4, 0], rotate: [0, -2, 2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <motion.div
          className="relative mt-7 grid h-16 w-20 place-items-center rounded-2xl bg-gold/15 text-4xl text-gold"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <FiLock />
        </motion.div>
        <div className="absolute bottom-3 flex gap-1.5">
          {[0, 1, 2, 3].map((index) => (
            <motion.span
              key={index}
              className="h-2.5 w-2.5 rounded-full bg-navy/50"
              animate={{ scale: [0.75, 1.2, 0.75], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.12 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (code === "403") {
    return (
      <div className="relative mx-auto grid h-28 w-28 place-items-center">
        <motion.div
          className="absolute h-24 w-24 rounded-full border-2 border-danger/25"
          animate={{ scale: [0.86, 1.08, 0.86], opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gold/15 text-5xl text-gold"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiShield />
        </motion.div>
        <motion.div
          className="absolute left-4 right-4 top-6 h-2 rounded-full bg-danger/70"
          animate={{ x: [-5, 5, -5], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-6 left-4 right-4 h-2 rounded-full bg-danger/70"
          animate={{ x: [5, -5, 5], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <motion.div
          className="absolute grid h-24 w-24 place-items-center text-6xl text-danger"
          animate={{ rotate: [-8, 0, -8], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiSlash />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto grid h-32 w-32 place-items-center">
      <motion.div
        className="absolute h-24 w-24 rounded-full border border-gold/25"
        animate={{ scale: [0.65, 1.35], opacity: [0.8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <motion.div
        className="absolute h-16 w-16 rounded-full border border-navy/10"
        animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.25, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute h-32 w-px origin-bottom bg-gold/35"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-black text-navy shadow-[0_10px_24px_rgba(27,38,59,0.14)]"
        animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        ?
      </motion.span>
      <motion.div
        className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gold/15 text-5xl text-gold"
        animate={{ rotate: [0, 8, -8, 0], x: [0, 5, -5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <FiSearch />
      </motion.div>
    </div>
  );
}
