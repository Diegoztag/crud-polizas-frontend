import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import './MainLayout.css';

const MainLayout = () => {
    return (
        <Box className="layout-container">
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                            src="/coppel-logo.png" 
                            alt="Coppel Logo" 
                            className="header-logo"
                        />
                        <Typography variant="h6">Sistema de Pólizas</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box className="main-content">
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
