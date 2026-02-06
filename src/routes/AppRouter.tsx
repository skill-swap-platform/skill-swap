import { Routes, Route } from "react-router-dom";
import { routesConfig } from "./routes.config";

const AppRouter = () => {
  return (
    <Routes>
      {routesConfig.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default AppRouter;
