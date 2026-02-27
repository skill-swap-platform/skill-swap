import { Navigate, useSearchParams } from "react-router-dom";

const SearchResults = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const target = q ? `/search?q=${encodeURIComponent(q)}` : "/search";

  return <Navigate to={target} replace />;
};

export default SearchResults;
