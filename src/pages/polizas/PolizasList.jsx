import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Typography,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { polizasApi } from "../../services/api";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from "@mui/material";
import './PolizasList.css';

const PolizasList = () => {
    const [polizas, setPolizas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [polizaToDelete, setPolizaToDelete] = useState(null);
    const navigate = useNavigate();

    const loadPolizas = async () => {
        try {
            const response = await polizasApi.getAll();
            console.log('Datos recibidos:', response.data);
            setPolizas(response.data.data || []);
        } catch (error) {
            console.error("Error al cargar pólizas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPolizas();
    }, []);

    const handleDelete = async (id) => {
        setPolizaToDelete(id);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await polizasApi.delete(polizaToDelete);
            loadPolizas();
            setOpenDialog(false);
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            maxWidth: '1200px',
            margin: '0 auto',
            px: 2
        }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                }}
            >
                <Typography variant="h5">Listado de Pólizas</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/poliza/new")}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    Nueva Póliza
                </Button>
            </Box>

            <TableContainer 
                component={Paper} 
                sx={{ 
                    flexGrow: 1,
                    overflow: 'auto',
                    boxShadow: 3,
                    position: 'relative',
                    maxHeight: 'calc(100vh - 180px)',
                }}
            >
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        position: 'absolute',
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1
                    }}>
                        <CircularProgress />
                    </Box>
                ) : null}
                
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Póliza</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>SKU</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Artículo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Cantidad</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Empleado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(polizas) && polizas.length > 0 ? (
                            polizas.map((item) => (
                                <TableRow 
                                    key={item?.poliza?.idPoliza || 'no-id'}
                                    hover
                                    sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
                                >
                                    <TableCell>{item?.poliza?.idPoliza}</TableCell>
                                    <TableCell>{item?.inventario?.sku}</TableCell>
                                    <TableCell>{item?.inventario?.nombre}</TableCell>
                                    <TableCell>{item?.poliza?.cantidad}</TableCell>
                                    <TableCell>
                                        {`${item?.empleado?.nombre || ''} ${item?.empleado?.apellido || ''}`}
                                    </TableCell>
                                    <TableCell>
                                        {item?.poliza?.fecha ? 
                                            new Date(item.poliza.fecha).toLocaleString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }).replace(/[/]/g, '-')
                                            : '-'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                onClick={() => navigate(`/poliza/edit/${item.poliza.idPoliza}`)}
                                                color="primary"
                                                size="small"
                                                title="Editar"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(item.poliza.idPoliza)}
                                                color="error"
                                                size="small"
                                                title="Eliminar"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No hay pólizas disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmar eliminación"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Está seguro que desea eliminar esta póliza? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDialog(false)} 
                        color="primary"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={confirmDelete} 
                        color="error" 
                        variant="contained" 
                        autoFocus
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PolizasList;