"use client";

import { useParams } from "next/navigation";

const SearchPage = () => {
  const { query } = useParams();
  return <div>{query}</div>;
};

export default SearchPage;
