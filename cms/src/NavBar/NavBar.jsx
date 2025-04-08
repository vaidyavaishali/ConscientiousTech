// NavBar Component
import React from "react";
import "./navBar.css";
import { useAuth } from "../contextAPI/UserContext";

const NavBar = () => {
  const [userauth] = useAuth();
  return (
    <nav className="shadow-lg shadow-gray-100 bg-slate-500 text-[white] w-[90%] h-[60px] mx-auto mt-[10px] px-[20px] box-border sticky top-[10px] mb-[20px]">
      <div className="py-[12px] mx-auto flex justify-between items-center">
        <div className="text-3xl font-bold">logo</div>
        <ul className="md:hidden flex text-white gap-10">
          <li>{userauth.user && userauth.user.email.split("@")[0]}</li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
