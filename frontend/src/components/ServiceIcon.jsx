import React from "react";
import { CloudCog, Landmark, BookOpenCheck, TrendingUp, Users, FileCheck2 } from "lucide-react";

const MAP = { CloudCog, Landmark, BookOpenCheck, TrendingUp, Users, FileCheck2 };

export default function ServiceIcon({ name, ...props }) {
  const Cmp = MAP[name] || CloudCog;
  return <Cmp {...props} />;
}
