import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const initialFormData = {
    claveCB: '', 
    laboratorio: '',
    costoUnitario: 0,
    totalEnzimas: 0,
    pedido: '',
    factura: '',
    proveedor: '',
    lote: '',
    caducidad: '', 
    responsable: '',
};

const FormularioEntrada = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [medicamentos, setMedicamentos] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const medsResponse = await apiClient.get('/inventario/medicamentos');
                setMedicamentos(medsResponse.data);
                const personalResponse = await apiClient.get('/inventario/personal');
                setPersonal(personalResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar catálogos:", error);
                setMensaje('❌ Error al conectar con el servidor. Revisa la consola y el backend.');
                setLoading(false);
            }
        };
        fetchData();
    }, []); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        let parsedValue = value;
        if (name === 'costoUnitario' || name === 'totalEnzimas') {
            parsedValue = value === '' ? 0 : parseFloat(value);
        }
        setFormData({ ...formData, [name]: parsedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        if (isNaN(formData.costoUnitario) || isNaN(formData.totalEnzimas) || formData.totalEnzimas <= 0) {
            setMensaje('❌ Error: El costo y la cantidad deben ser válidos y mayores a cero.');
            return;
        }

        try {
            const response = await apiClient.post('/inventario/movimientos/entrada', formData);
            setMensaje(`✅ ${response.data.message} (Lote: ${formData.lote})`);
            setFormData(initialFormData);
        } catch (error) {
            const msg = error.response?.data?.message || 'Error desconocido al registrar la entrada.';
            setMensaje(`❌ Error: ${msg}`);
            console.error('Error de API:', error.response || error);
        }
    };

    const medicamentoSeleccionado = medicamentos.find(m => m.claveCB === formData.claveCB);
    const costoTotal = (parseFloat(formData.costoUnitario) || 0) * (parseFloat(formData.totalEnzimas) || 0);

    if (loading) return <h2 className="texto-cargando">Cargando catálogos...</h2>;

    return (
        <div className="container formulario-container">
            <h1>Registro de Entrada Hospitalaria</h1>

            {mensaje && (
                <div className={`alerta ${mensaje.startsWith('✅') ? 'alerta-exito' : 'alerta-error'}`}>
                    {mensaje}
                </div>
            )}

            <form onSubmit={handleSubmit} className="formulario-grid">
                {/* --- COLUMNA 1 --- */}
                <div className="columna">
                    <h2>Datos del Medicamento</h2>

                    <label>Clave CB:</label>
                    <select name="claveCB" value={formData.claveCB} onChange={handleChange} required>
                        <option value="">Seleccione el medicamento</option>
                        {medicamentos.map(med => (
                            <option key={med.claveCB} value={med.claveCB}>
                                {med.claveCB} - {med.descripcion}
                            </option>
                        ))}
                    </select>

                    {medicamentoSeleccionado && (
                        <div className="detalle-medicamento">
                            <p><strong>Descripción:</strong> {medicamentoSeleccionado.descripcion}</p>
                            <p><strong>Presentación:</strong> {medicamentoSeleccionado.presentacion}</p>
                        </div>
                    )}

                    <label>Proveedor:</label>
                    <input type="text" name="proveedor" value={formData.proveedor} onChange={handleChange} required />

                    <label>Factura:</label>
                    <input type="text" name="factura" value={formData.factura} onChange={handleChange} required />

                    <label>Pedido:</label>
                    <input type="text" name="pedido" value={formData.pedido} onChange={handleChange} required />

                    <label>Laboratorio:</label>
                    <input type="text" name="laboratorio" value={formData.laboratorio} onChange={handleChange} required />
                </div>

                {/* --- COLUMNA 2 --- */}
                <div className="columna">
                    <h2>Datos del Lote</h2>

                    <label>Lote:</label>
                    <input type="text" name="lote" value={formData.lote} onChange={handleChange} required />

                    <label>Caducidad:</label>
                    <input type="date" name="caducidad" value={formData.caducidad} onChange={handleChange} required />

                    <label>Costo Unitario ($):</label>
                    <input type="number" name="costoUnitario" min="0" step="0.01" value={formData.costoUnitario} onChange={handleChange} required />

                    <label>Total de Enzimas:</label>
                    <input type="number" name="totalEnzimas" min="1" value={formData.totalEnzimas} onChange={handleChange} required />

                    <p className="costo-total">
                        Costo Total del Lote: <strong>${costoTotal.toFixed(2)}</strong>
                    </p>

                    <label>Responsable:</label>
                    <select name="responsable" value={formData.responsable} onChange={handleChange} required>
                        <option value="">Seleccione el responsable</option>
                        {personal.map((p, i) => (
                            <option key={p._id || i} value={p.nombre}>
                                {p.nombre} ({p.cargo})
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="btn-hospital">
                        Registrar Entrada
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEntrada;
