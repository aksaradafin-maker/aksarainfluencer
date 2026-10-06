"use client";

import React from "react";

type CtaProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Cta({ children, className = "" }: CtaProps) {
  return (
    <a
      href="https://lynk.id/a/1911036127"
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}