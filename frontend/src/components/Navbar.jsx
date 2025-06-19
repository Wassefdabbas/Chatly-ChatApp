import { Link, } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, Menu } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Navbar = ({ onMenuClick }) => {
  const { authUser } = useAuthUser();
  // const location = useLocation();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button 
              className="btn btn-ghost btn-circle lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="hidden sm:inline-block text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Chatly
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <div className="avatar">
              <div className="w-9 rounded-full">
                <Link to="/onboarding">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </Link>
              </div>
            </div>

            <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;