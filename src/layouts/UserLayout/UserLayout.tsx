import { Outlet } from "react-router-dom";

const UserLayout = (): JSX.Element => {
  return (
    <div className="UserLayout">
      <Outlet />
    </div>
  );
};

export default UserLayout;
