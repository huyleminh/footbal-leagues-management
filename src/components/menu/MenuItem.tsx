import { Box, Typography } from "@mui/material";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { ExpandMoreRounded, ExpandLessRounded } from "@mui/icons-material"
import { useState } from "react";
import "./styles.scss"
import { MenuItemType } from "../../@types/ComponentInterfaces";

function MenuItem(props: MenuItemType) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const {
        icon,
        path,
        label,
        subMenu,
        className
    } = props

    const resolved = useResolvedPath(path || "unknown")
    const match = useMatch({ path: resolved.pathname, end: true })

    const handleOnClick = () => {
        if (subMenu) {
            setIsOpen(!isOpen)
        } else {
            navigate(path || "#")
        }
    }

    return (
        <Box>
            <Box className={`navigation-item ${className || ""} ${match ? "active" : ""}`} onClick={handleOnClick}>
                {icon ? icon : null}
                <Typography variant="h6" sx={{
                    marginLeft: "10px",
                    flexGrow: "1"
                }}>{label}</Typography>
                {subMenu ? (
                    isOpen ? <ExpandLessRounded /> : <ExpandMoreRounded />
                ) : (null)}
            </Box>
            {
                subMenu ? (
                    subMenu.map((menu, index) => (
                        <MenuItem
                            className={`navigation-sub-menu ${!isOpen ? "hidden" : ""}`}
                            key={index}
                            label={menu.label}
                            role={menu.role}
                            path={menu.path || "#"}
                            subMenu={menu.subMenu || undefined}
                            icon={menu.icon || undefined}
                        />
                    ))
                ) : (null)
            }
        </Box>
    );
}

export default MenuItem;
