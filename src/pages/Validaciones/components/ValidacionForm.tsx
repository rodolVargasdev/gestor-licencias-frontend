import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import type { CreateValidacionDTO, UpdateValidacionDTO } from '../../../types/validacion';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { createValidacion, updateValidacion } from '../../../store/slices/validacionesSlice';
import { fetchTiposLicencias } from '../../../store/slices/tiposLicenciasSlice';
import { fetchTrabajadores } from '../../../store/slices/trabajadoresSlice';

interface ValidacionFormProps {
  initialValues?: CreateValidacionDTO;
  isEditing?: boolean;
  id?: number;
}

const validationSchema = Yup.object({
  tipo_licencia_id: Yup.number()
    .required('El tipo de licencia es requerido'),
  trabajador_id: Yup.number()
    .required('El trabajador es requerido'),
  fecha_inicio: Yup.string()
    .required('La fecha de inicio es requerida'),
  fecha_fin: Yup.string()
    .required('La fecha de fin es requerida')
    .test('fecha-fin-despues', 'La fecha de fin debe ser posterior a la fecha de inicio', 
      function(value) {
        const { fecha_inicio } = this.parent;
        if (!fecha_inicio || !value) return true;
        return new Date(value) >= new Date(fecha_inicio);
    }),
  observaciones: Yup.string()
    .max(500, 'Las observaciones no pueden tener más de 500 caracteres')
});

const ValidacionForm: React.FC<ValidacionFormProps> = ({
  initialValues,
  isEditing = false,
  id
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: tiposLicencias } = useAppSelector((state) => state.tiposLicencias);
  const { items: trabajadores } = useAppSelector((state) => state.trabajadores);

  useEffect(() => {
    dispatch(fetchTiposLicencias());
    dispatch(fetchTrabajadores());
  }, [dispatch]);

  const formik = useFormik<CreateValidacionDTO>({
    initialValues: {
      tipo_licencia_id: initialValues?.tipo_licencia_id || 0,
      trabajador_id: initialValues?.trabajador_id || 0,
      fecha_inicio: initialValues?.fecha_inicio || '',
      fecha_fin: initialValues?.fecha_fin || '',
      observaciones: initialValues?.observaciones || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing && id) {
          const updateData: UpdateValidacionDTO = {
            ...values,
            estado: 'pendiente'
          };
          await dispatch(updateValidacion({ id, data: updateData })).unwrap();
        } else {
          await dispatch(createValidacion(values)).unwrap();
        }
        navigate('/validaciones');
      } catch (error) {
        console.error('Error al guardar:', error);
      }
    }
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? 'Editar Validación' : 'Nueva Validación'}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Licencia</InputLabel>
              <Select
                name="tipo_licencia_id"
                value={formik.values.tipo_licencia_id}
                onChange={formik.handleChange}
                error={formik.touched.tipo_licencia_id && Boolean(formik.errors.tipo_licencia_id)}
                label="Tipo de Licencia"
              >
                {tiposLicencias.map(tipo => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Trabajador</InputLabel>
              <Select
                name="trabajador_id"
                value={formik.values.trabajador_id}
                onChange={formik.handleChange}
                error={formik.touched.trabajador_id && Boolean(formik.errors.trabajador_id)}
                label="Trabajador"
              >
                {trabajadores.map(trabajador => (
                  <MenuItem key={trabajador.id} value={trabajador.id}>
                    {`${trabajador.nombre} ${trabajador.apellido}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="fecha_inicio"
              label="Fecha de Inicio"
              type="date"
              value={formik.values.fecha_inicio}
              onChange={formik.handleChange}
              error={formik.touched.fecha_inicio && Boolean(formik.errors.fecha_inicio)}
              helperText={formik.touched.fecha_inicio && formik.errors.fecha_inicio}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="fecha_fin"
              label="Fecha de Fin"
              type="date"
              value={formik.values.fecha_fin}
              onChange={formik.handleChange}
              error={formik.touched.fecha_fin && Boolean(formik.errors.fecha_fin)}
              helperText={formik.touched.fecha_fin && formik.errors.fecha_fin}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="observaciones"
              name="observaciones"
              label="Observaciones"
              multiline
              rows={4}
              value={formik.values.observaciones}
              onChange={formik.handleChange}
              error={formik.touched.observaciones && Boolean(formik.errors.observaciones)}
              helperText={formik.touched.observaciones && formik.errors.observaciones}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/validaciones')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ValidacionForm; 