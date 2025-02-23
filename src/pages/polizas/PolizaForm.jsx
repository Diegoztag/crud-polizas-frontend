import { useState } from 'react';
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
    Alert
} from '@mui/material';
import { polizasApi } from '../../services/api';

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

    const validateField = (name, value) => {
        switch (name) {
            case 'sku':
                return value.trim() === '' ? 'El SKU es requerido' : '';
            case 'cantidad':
                return value <= 0 ? 'La cantidad debe ser mayor a 0' : '';
            case 'idEmpleado':
                return value.trim() === '' ? 'El ID de empleado es requerido' : '';
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
                                <TextField
                                    fullWidth
                                    label="SKU"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    error={touched.sku && !!errors.sku}
                                    helperText={touched.sku && errors.sku}
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
                                <TextField
                                    fullWidth
                                    label="ID Empleado"
                                    name="idEmpleado"
                                    value={formData.idEmpleado}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    error={touched.idEmpleado && !!errors.idEmpleado}
                                    helperText={touched.idEmpleado && errors.idEmpleado}
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