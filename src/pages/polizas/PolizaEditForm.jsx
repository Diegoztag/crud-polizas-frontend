import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    CircularProgress,
    Autocomplete,
    Snackbar,
    Alert
} from '@mui/material';
import { polizasApi, empleadosApi, inventarioApi } from '../../services/api';

const PolizaEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);
    const [empleadoInicial, setEmpleadoInicial] = useState(null);
    const [empleados, setEmpleados] = useState([]);
    const [formData, setFormData] = useState({
        sku: '',
        cantidad: '',
        idEmpleado: '',
        empleadoSeleccionado: null,
        productoSeleccionado: null
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [touched, setTouched] = useState({
        idEmpleado: false
    });

    const [errors, setErrors] = useState({
        idEmpleado: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            setInitialLoading(true);
            setLoadingEmpleados(true);
            try {
                const polizaResponse = await polizasApi.getById(id);
                const polizaData = polizaResponse.data.data;
                
                const [empleadosResponse, empleadoResponse, productoResponse] = await Promise.all([
                    empleadosApi.getAll(),
                    empleadosApi.getById(polizaData.empleado.idEmpleado),
                    inventarioApi.getBySku(polizaData.inventario.sku)
                ]);

                const empleadosData = empleadosResponse.data.data || [];
                const empleadoActual = empleadoResponse.data.data;
                const productoData = productoResponse.data.data;
                
                setEmpleados(empleadosData);
                setEmpleadoInicial(empleadoActual);
                
                setFormData({
                    sku: polizaData.inventario.sku,
                    cantidad: polizaData.poliza.cantidad,
                    idEmpleado: polizaData.empleado.id,
                    empleadoSeleccionado: empleadoActual,
                    productoSeleccionado: productoData
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setInitialLoading(false);
                setLoadingEmpleados(false);
            }
        };

        cargarDatos();
    }, [id]);

    const validateField = (name, value) => {
        switch (name) {
            case 'idEmpleado':
                return !value ? 'El empleado es requerido' : '';
            default:
                return '';
        }
    };

    const anyChange = () => {
        if (!empleadoInicial || !formData.empleadoSeleccionado) return false;
        return empleadoInicial.id !== formData.empleadoSeleccionado.id;
    };

    const filtrarEmpleadosPorTermino = (empleados, searchTerm) => {
        return empleados.filter(empleado => 
            empleado.id?.toString().includes(searchTerm) ||
            empleado.nombre?.toLowerCase().includes(searchTerm) ||
            empleado.apellido?.toLowerCase().includes(searchTerm) ||
            empleado.puesto?.toLowerCase().includes(searchTerm)
        );
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setTouched({
            idEmpleado: true
        });

        const newErrors = {
            idEmpleado: formData.empleadoSeleccionado ? '' : 'El empleado es requerido'
        };
        
        setErrors(newErrors);
    
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }
    
        setIsSubmitting(true);
        try {
            await polizasApi.updateEmpleado(id, formData.empleadoSeleccionado.id);
            setSnackbar({
                open: true,
                message: 'Póliza actualizada exitosamente',
                severity: 'success'
            });
            setTimeout(() => {
                navigate('/polizas');
            }, 2000);
        } catch (error) {
            console.error('Error al actualizar la póliza:', error);
            setSnackbar({
                open: true,
                message: 'Error al actualizar la póliza',
                severity: 'error'
            });
            setIsSubmitting(false);
        }
    };

    if (initialLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Editar Póliza
                    </Typography>
                    
                    <form onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={[]}
                                    value={formData.productoSeleccionado}
                                    disabled={true}
                                    getOptionLabel={(option) => `${option.sku} - ${option.nombre}`}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Producto"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Cantidad"
                                    name="cantidad"
                                    type="number"
                                    value={formData.cantidad}
                                    disabled={true}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={empleados}
                                    value={formData.empleadoSeleccionado}
                                    noOptionsText="No se encontraron empleados"
                                    getOptionLabel={(option) => `${option.id} - ${option.nombre} ${option.apellido} - ${option.puesto}`}
                                    loading={loadingEmpleados}
                                    filterOptions={(options, { inputValue }) => {
                                        const searchTerm = inputValue.toLowerCase();
                                        return filtrarEmpleadosPorTermino(options, searchTerm);
                                    }}
                                    onChange={(event, newValue) => {
                                        const newIdEmpleado = newValue ? newValue.id : '';
                                        setFormData(prev => ({
                                            ...prev,
                                            idEmpleado: newIdEmpleado,
                                            empleadoSeleccionado: newValue
                                        }));
                                        setErrors(prev => ({
                                            ...prev,
                                            idEmpleado: validateField('idEmpleado', newIdEmpleado)
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Buscar empleado"
                                            required
                                            error={touched.idEmpleado && !!errors.idEmpleado}
                                            helperText={touched.idEmpleado && errors.idEmpleado}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingEmpleados ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/polizas')}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting || !anyChange()}
                                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                    >
                                        Editar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </motion.div>
    );
};

export default PolizaEditForm;