import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
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
                <AnimatePresence mode="wait">
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}>
                        <Outlet />
                    </motion.div>
                </AnimatePresence>          
            </Box>
        </Box>
    );
};

export default MainLayout;
