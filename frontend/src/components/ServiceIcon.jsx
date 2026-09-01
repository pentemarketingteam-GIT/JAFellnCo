import React from "react";
import { CloudCog, Landmark, BookOpenCheck, TrendingUp, Users, FileCheck2, Building2, ShieldCheck } from "lucide-react";

const MAP = { CloudCog, Landmark, BookOpenCheck, TrendingUp, Users, FileCheck2, Building2, ShieldCheck };

export default function ServiceIcon({ name, ...props }) {
  const Cmp = MAP[name] || Landmark;
  return <Cmp {...props} />;
}
