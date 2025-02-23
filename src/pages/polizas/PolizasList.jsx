import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
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
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
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
    const [filtros, setFiltros] = useState({
        busqueda: '',
        ordenarPor: 'fecha',
        orden: 'desc'
    });
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

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filtrarPolizas = (polizas) => {
        return polizas.filter(item => {
            const searchTerm = filtros.busqueda.toLowerCase();
            return (
                item?.poliza?.idPoliza?.toString().includes(searchTerm) ||
                item?.inventario?.sku?.toLowerCase().includes(searchTerm) ||
                item?.inventario?.nombre?.toLowerCase().includes(searchTerm) ||
                item?.empleado?.nombre?.toLowerCase().includes(searchTerm) ||
                item?.empleado?.apellido?.toLowerCase().includes(searchTerm)
            );
        }).sort((a, b) => {
            switch (filtros.ordenarPor) {
                case 'fecha':
                    return filtros.orden === 'asc' 
                        ? new Date(a.poliza.fecha) - new Date(b.poliza.fecha)
                        : new Date(b.poliza.fecha) - new Date(a.poliza.fecha);
                case 'sku':
                    return filtros.orden === 'asc'
                        ? a.inventario.sku.localeCompare(b.inventario.sku)
                        : b.inventario.sku.localeCompare(a.inventario.sku);
                default:
                    return 0;
            }
        });
    };

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}>
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
                        onClick={() => navigate("/poliza/crear")}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        Nueva Póliza
                    </Button>
                </Box>

                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Buscar"
                        name="busqueda"
                        value={filtros.busqueda}
                        onChange={handleFiltroChange}
                        sx={{ minWidth: 200 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Ordenar por</InputLabel>
                        <Select
                            name="ordenarPor"
                            value={filtros.ordenarPor}
                            onChange={handleFiltroChange}
                            label="Ordenar por"
                        >
                            <MenuItem value="fecha">Fecha</MenuItem>
                            <MenuItem value="sku">SKU</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Orden</InputLabel>
                        <Select
                            name="orden"
                            value={filtros.orden}
                            onChange={handleFiltroChange}
                            label="Orden"
                        >
                            <MenuItem value="asc">Ascendente</MenuItem>
                            <MenuItem value="desc">Descendente</MenuItem>
                        </Select>
                    </FormControl>
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
                            filtrarPolizas(polizas).map((item) => (
                                    <TableRow 
                                        key={item?.poliza?.idPoliza || 'no-id'}
                                        hover
                                        sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
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
                                                    onClick={() => navigate(`/poliza/editar/${item.poliza.idPoliza}`)}
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
        </motion.div>
    );
};

export default PolizasList;