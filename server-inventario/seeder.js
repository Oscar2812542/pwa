// seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicamento from './models/Medicamento.js';
import Personal from './models/Personal.js';
import InventarioLote from './models/InventarioLote.js';
import Movimiento from './models/Movimiento.js';

dotenv.config();

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado para seeding...');
    } catch (err) {
        console.error(`Error de conexión a MongoDB: ${err.message}`);
        process.exit(1);
    }
};

// =====================
// Datos de prueba
// =====================

const medicamentosData = [
    { claveCB: '010.000.5550.00', descripcion: 'IDURSULFASA', presentacion: 'SOLUCIÓN IV. 6mg/3mL.' },
    { claveCB: '010.000.5547.00', descripcion: 'LARONIDASA', presentacion: 'SOLUCIÓN INY. IV. 2.9mg/5mL (0.58mg/mL).' },
];

const personalData = [
    { id: '1', nombre: 'Q.F.B. MARIA HUERTA GARCIA', cargo: 'RESPONSABLE SANITARIO DE FARMACIA' },
    { id: '2', nombre: 'DR. JUAN PEREZ LOPEZ', cargo: 'MEDICO TRATANTE' },
];

const inventarioLoteData = [
    {
        claveCB: '010.000.5550.00',
        lote: 'L001',
        caducidad: new Date('2025-12-31'),
        stock: 100,
        costoUnitario: 2,
    },
    {
        claveCB: '010.000.5547.00',
        lote: 'L002',
        caducidad: new Date('2025-11-30'),
        stock: 50,
        costoUnitario: 3,
    },
];

const movimientosData = [
    {
        tipoMovimiento: 'Entrada',
        claveCB: '010.000.5550.00',
        responsable: 'Q.F.B. MARIA HUERTA GARCIA',
        datosEntrada: {
            laboratorio: 'Lab A',
            costoUnitario: 2,
            totalEnzimas: 100,
            pedido: 'PED001',
            factura: 'FAC001',
            proveedor: 'Proveedor A',
            lote: 'L001',
            caducidad: new Date('2025-12-31'),
            cantidadInicial: 100,
            existenciaActual: 100
        }
    },
    {
        tipoMovimiento: 'Salida',
        claveCB: '010.000.5550.00',
        responsable: 'DR. JUAN PEREZ LOPEZ',
        datosSalida: {
            motivoSalida: 'Administración a Paciente',
            cantidadEnzimasSalida: 20,
            datosPaciente: 'Paciente 001'
        },
        cantidadTotal: 20,
        detalles: [
            { lote: 'L001', cantidad: 20, costoUnitario: 2, caducidad: new Date('2025-12-31') }
        ]
    }
];

// =====================
// Funciones de import y destroy
// =====================

const importData = async () => {
    try {
        await connectDB();

        // Limpiar colecciones
        await Medicamento.deleteMany();
        await Personal.deleteMany();
        await InventarioLote.deleteMany();
        await Movimiento.deleteMany();

        // Insertar datos
        const medicamentos = await Medicamento.insertMany(medicamentosData);
        const personal = await Personal.insertMany(personalData);
        const inventarios = await InventarioLote.insertMany(inventarioLoteData);
        const movimientos = await Movimiento.insertMany(movimientosData);

        console.log('✅ Seed completo: Medicamentos, Personal, InventarioLote y Movimientos');
        process.exit();
    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Medicamento.deleteMany();
        await Personal.deleteMany();
        await InventarioLote.deleteMany();
        await Movimiento.deleteMany();

        console.log('🗑️ Datos eliminados correctamente');
        process.exit();
    } catch (error) {
        console.error('❌ Error al eliminar datos:', error);
        process.exit(1);
    }
};

// =====================
// Ejecutar según argumento
// =====================

if (process.argv[2] === '--destroy') {
    destroyData();
} else {
    importData();
}
