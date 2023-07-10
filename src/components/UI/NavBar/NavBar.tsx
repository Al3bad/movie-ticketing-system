import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import user_profile from "../../../assets/user_profile.png";
import Icon from "../Icon/Icon";

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
      <li>
        <Link to="/dashboard">
          <span>
            <Icon name="dashboard" />
          </span>
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/">
          <span>
            <Icon name="cart" />
          </span>
          Purchase Ticket
        </Link>
      </li>
      <li>
        <Link to="/customer">
          <span>
            <Icon name="customer" />
          </span>
          Customers
        </Link>
      </li>
      <li>
        <Link to="/ticket">
          <span>
            <Icon name="ticket" />
          </span>
          Tickets
        </Link>
      </li>
      <li>
        <Link to="/movie">
          <span>
            <Icon name="movie" />
          </span>
          Movies
        </Link>
      </li>
      <li>
        <Link to="/booking">
          <span>
            <Icon name="clock" />
          </span>
          Bookings
        </Link>
      </li>
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
