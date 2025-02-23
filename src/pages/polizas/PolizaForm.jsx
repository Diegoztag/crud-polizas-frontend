import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    CircularProgress,
    Snackbar,
    Alert,
    Autocomplete
} from '@mui/material';
import { polizasApi, empleadosApi, inventarioApi } from '../../services/api';

const PolizaForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        sku: '',
        cantidad: '',
        idEmpleado: ''
    });
    const [errors, setErrors] = useState({
        sku: '',
        cantidad: '',
        idEmpleado: ''
    });
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setLoadingEmpleados(true);
            setLoadingProductos(true);
            try {
                const [empleadosResponse, productosResponse] = await Promise.all([
                    empleadosApi.getAll(),
                    inventarioApi.getAll()
                ]);
                
                setEmpleados(empleadosResponse.data.data || []);
                setProductos(productosResponse.data.data || []);
            } catch (error) {
                console.error('Error al cargar datos iniciales:', error);
            } finally {
                setLoadingEmpleados(false);
                setLoadingProductos(false);
            }
        };

        cargarDatosIniciales();
    }, []);

    const buscarProductos = async (searchTerm) => {
        if (!searchTerm) return;
        setLoadingProductos(true);
        try {
            const response = await inventarioApi.getBySku(searchTerm);
            setProductos(response.data.data || []);
        } catch (error) {
            console.error('Error al buscar productos:', error);
        } finally {
            setLoadingProductos(false);
        }
    };

    const filtrarEmpleadosPorTermino = (empleados, searchTerm) => {
        return empleados.filter(empleado => 
            empleado.id?.toString().includes(searchTerm) ||
            empleado.nombre?.toLowerCase().includes(searchTerm) ||
            empleado.apellido?.toLowerCase().includes(searchTerm) ||
            empleado.puesto?.toLowerCase().includes(searchTerm)
        );
    };

    const filtrarProductosPorTermino = (productos, searchTerm) => {
        return productos.filter(producto => 
            producto.sku?.toLowerCase().includes(searchTerm) ||
            producto.nombre?.toLowerCase().includes(searchTerm)
        );
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'sku':
                return !value ? 'El SKU es requerido' : '';
            case 'cantidad':
                return !value || value <= 0 ? 'La cantidad debe ser mayor a 0' : '';
            case 'idEmpleado':
                return !value ? 'El empleado es requerido' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const [touched, setTouched] = useState({
        sku: false,
        cantidad: false,
        idEmpleado: false
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setTouched({
            sku: true,
            cantidad: true,
            idEmpleado: true
        });

        const newErrors = {
            sku: validateField('sku', formData.sku),
            cantidad: validateField('cantidad', formData.cantidad),
            idEmpleado: validateField('idEmpleado', formData.idEmpleado)
        };
        
        setErrors(newErrors);
    
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }
    
        setIsSubmitting(true);
        try {
            await polizasApi.create(formData);
            setSnackbar({
                open: true,
                message: 'Póliza creada exitosamente',
                severity: 'success'
            });
            setTimeout(() => {
                navigate('/polizas');
            }, 2000);
        } catch (error) {
            console.error('Error al crear la póliza:', error);
            setSnackbar({
                open: true,
                message: 'Error al crear la póliza',
                severity: 'error'
            });
            setIsSubmitting(false);
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Nueva Póliza
                    </Typography>
                    
                    <form onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={productos}
                                    getOptionLabel={(option) => `${option.sku} - ${option.nombre}`}
                                    loading={loadingProductos}
                                    noOptionsText="No se encontraron productos"
                                    filterOptions={(options, { inputValue }) => {
                                        const searchTerm = inputValue.toLowerCase();
                                        return filtrarProductosPorTermino(options, searchTerm);
                                    }}
                                    onChange={(event, newValue) => {
                                        const newSku = newValue ? newValue.sku : '';
                                        setFormData(prev => ({
                                            ...prev,
                                            sku: newSku
                                        }));
                                        setErrors(prev => ({
                                            ...prev,
                                            sku: validateField('sku', newSku)
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Buscar producto"
                                            required
                                            error={touched.sku && !!errors.sku}
                                            helperText={touched.sku && errors.sku}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingProductos ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
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
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                inputProps={{ min: "1" }}
                                error={touched.cantidad && !!errors.cantidad}
                                helperText={touched.cantidad && errors.cantidad}
                            />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={empleados}
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
                                            idEmpleado: newIdEmpleado
                                        }));
                                        // Actualizar el error cuando se selecciona un empleado
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
                                        disabled={isSubmitting}
                                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                    >
                                        Guardar
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

export default PolizaForm;