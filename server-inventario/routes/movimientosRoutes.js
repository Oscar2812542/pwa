/**
 * Archivo: routes/movimientosRoutes.js
 * Descripción: Define el endpoint para obtener el historial completo de movimientos
 * (entradas y salidas) del inventario.
 */
import { Router } from 'express';
// Asegúrate de que esta importación apunte a donde tienes tu lógica de DB
import * as movimientosController from '../controllers/movimientosController.js'; 

const router = Router();

// GET /api/movimientos/historial
// Obtiene una lista unificada y cronológica de todas las entradas y salidas.
router.get('/historial', movimientosController.getHistorialMovimientos);

export default router;
