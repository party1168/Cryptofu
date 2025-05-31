"use client";
import { useState } from "react";
import Dashboard from "./dashboard/page";

interface User {
  name: string;
  email: string;
}

export default function Page() {
  return <Dashboard />;
}
