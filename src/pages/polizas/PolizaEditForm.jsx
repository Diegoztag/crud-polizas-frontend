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
    CircularProgress
} from '@mui/material';
import { polizasApi } from '../../services/api';

const PolizaEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: ''
    });

    const [errors, setErrors] = useState({
        nombre: '',
        apellido: ''
    });

    const validateField = (name, value) => {
        switch (name) {
            case 'nombre':
                return value.trim() === '' ? 'El nombre es requerido' : '';
            case 'apellido':
                return value.trim() === '' ? 'El apellido es requerido' : '';
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
        nombre: false,
        apellido: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setTouched({
            nombre: true,
            apellido: true
        });

        const newErrors = {
            nombre: validateField('nombre', formData.nombre),
            apellido: validateField('apellido', formData.apellido)
        };
        
        setErrors(newErrors);
    
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }
    
        setLoading(true);
        try {
            await polizasApi.update(id, formData);
            navigate('/polizas');
        } catch (error) {
            console.error('Error al actualizar la póliza:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    useEffect(() => {
        const loadPoliza = async () => {
            try {
                const response = await polizasApi.getById(id);
                const polizaData = response.data.data;
                setFormData({
                    nombre: polizaData.empleado.nombre,
                    apellido: polizaData.empleado.apellido
                });
            } catch (error) {
                console.error('Error al cargar la póliza:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        loadPoliza();
    }, [id]);

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
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    error={touched.nombre && !!errors.nombre}
                                    helperText={touched.nombre && errors.nombre}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Apellido"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    error={touched.apellido && !!errors.apellido}
                                    helperText={touched.apellido && errors.apellido}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/polizas')}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : null}
                                    >
                                        Guardar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </motion.div>
    );
};

export default PolizaEditForm;