import { useNavigate } from "react-router-dom";

const Brand = () => {
  const navigate = useNavigate();
  return (
    <div
      className="mb-8 absolute top-5 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <span className="text-2xl font-semibold tracking-tight">
        <span className="font-poppins font-normal text-warning">Skill</span>
        <span className="font-poppins font-bold text-primary">Swap</span>
        <span className="font-poppins font-bold text-warning">.</span>
      </span>
    </div>
  );
};

export default Brand;
