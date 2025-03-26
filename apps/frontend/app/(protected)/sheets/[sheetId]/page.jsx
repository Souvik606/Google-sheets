import React from "react";

const page = async ({ params }) => {
  const { sheetId } = await params;
  return <div>{sheetId}</div>;
};

export default page;
