"use client";

import { useParams } from "next/navigation";

const SpreadSheetPage = () => {
  const { sheetId } = useParams();
  return <div>{sheetId}</div>;
};

export default SpreadSheetPage;
