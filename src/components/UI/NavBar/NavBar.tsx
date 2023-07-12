import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import user_profile from "../../../assets/user_profile.png";
import Icon from "../Icon/Icon";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Purchase Ticket",
    url: "/",
    icon: "cart",
  },
  {
    title: "Customer",
    url: "/customers",
    icon: "customer",
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: "ticket",
  },
  {
    title: "Movies",
    url: "/movies",
    icon: "movie",
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: "clock",
  },
];

type NavBarProps = {
  active: string;
  className?: string;
};

const NavBar: React.FC<NavBarProps> = (props) => {
  const [isResized, setIsResized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);

  useEffect(() => {
    if (!isResized) {
      screenSizeHandler();
    }
    checkScreenResize();
  }, [isResized]);

  const checkScreenResize = () => {
    window.addEventListener("resize", () => {
      if (!isResized) {
        setIsResized(true);
      }
      screenSizeHandler();
    });
  };

  const screenSizeHandler = () => {
    if (window.innerWidth > 760) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  const toggleMenuHandler = () => {
    setIsMenuShown((currentMenuState) => !currentMenuState);
  };

  const userProfile = (
    <div className={styles["navbar__user-profile"]}>
      {/* TO DO Update img src with real user profile pic */}
      <img src={user_profile}></img>
    </div>
  );

  const menu = (
    <ul className={styles["navbar__menu"]}>
      {menuItems.map((item, id) => {
        return (
          <li key={id}>
            <span>
              <Icon name={item.icon} />
            </span>
            <NavLink
              to={item.url}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              {item.title}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`${styles.navbar} ${props.className}`}>
      {isMobile && (
        <>
          <div className={styles["navbar__mobile-header"]}>
            {userProfile}
            <div
              className={styles["navbar__menu-icon"]}
              onClick={toggleMenuHandler}
            >
              <Icon name={isMenuShown ? "close" : "hamburger"} />
            </div>
          </div>
          {isMenuShown && menu}
        </>
      )}

      {!isMobile && (
        <>
          <div>{userProfile} </div>
          {menu}
        </>
      )}
    </div>
  );
};

export default NavBar;
