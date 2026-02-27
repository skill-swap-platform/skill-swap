import { Navigate, useSearchParams } from "react-router-dom";

const SearchWithFilters = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const target = q ? `/search?q=${encodeURIComponent(q)}` : "/search";

  return <Navigate to={target} replace />;
};

export default SearchWithFilters;
