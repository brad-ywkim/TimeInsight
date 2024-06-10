import { Link, useLocation } from "react-router-dom";
import "./sideMenu.css";

const SideMenu = (props) => {
  const { menuItems, setMenuItems, setSelectedCategory, type } = props;
  const location = useLocation();

  const changeMenu = (index) => {
    const newMenus = menuItems.map((menu, idx) => ({
      ...menu,
      active: idx === index,
    }));
    setMenuItems(newMenus);
    if (setSelectedCategory) {
      setSelectedCategory(newMenus[index].url);
    }
  };

  return (
    <div className="sideMenu">
      <ul>
        {menuItems.map((item, index) => {
          const isActive = location.pathname.includes(
            "/" + type + "/" + item.url
          );
          return (
            <li key={index} onClick={() => changeMenu(index)}>
              <Link
                to={"/" + type + "/" + item.url}
                className={isActive ? "active-side" : ""}
              >
                {item.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideMenu;
