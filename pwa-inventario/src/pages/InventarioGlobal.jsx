import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/apiClient';

const INVENTORY_TABLE_ID = 'inventario-table';

// Función para determinar color del semáforo
const getExpirationStatus = (diasParaVencer) => {
    if (diasParaVencer === null || diasParaVencer === undefined) return 'gray';
    const days = Number(diasParaVencer);
    if (days <= 30) return 'red';
    if (days <= 90) return 'yellow';
    return 'green';
};

const InventarioGlobal = () => {
    const [inventario, setInventario] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventario = async () => {
            try {
                const response = await apiClient.get('/inventario');
                setInventario(response.data || []);
            } catch (err) {
                console.error(err);
                setError('❌ Error al cargar el inventario. Verifica el servidor.');
            } finally {
                setLoading(false);
            }
        };
        fetchInventario();
    }, []);

    const filteredInventario = useMemo(() => {
        if (!searchTerm) return inventario;
        const lowerSearch = searchTerm.toLowerCase();
        return inventario.filter(item => {
            const claveCB = item.claveCB?.toLowerCase() || '';
            const descripcion = item.descripcion?.toLowerCase() || '';
            return claveCB.includes(lowerSearch) || descripcion.includes(lowerSearch);
        });
    }, [inventario, searchTerm]);

    if (loading) return <h2>Cargando Inventario Global...</h2>;
    if (error) return <p className="alerta-error">{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            {/* Título separado */}
            <h1>Inventario Global Hospitalario</h1>

            {/* Buscador */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="search">Buscar por Clave o Descripción:</label>
                <input
                    type="text"
                    id="search"
                    placeholder="Escribe aquí..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        display: 'block',
                        marginTop: '5px',
                        padding: '8px',
                        width: '100%',
                        borderRadius: '6px',
                        border: '1px solid #ccc'
                    }}
                />
            </div>

            <p aria-live="polite">
                Total de productos: <strong>{inventario.length}</strong> (Mostrando: <strong>{filteredInventario.length}</strong>)
            </p>

            {filteredInventario.length === 0 && searchTerm && (
                <p className="alerta-error">
                    No se encontraron resultados para "<strong>{searchTerm}</strong>".
                </p>
            )}

            {/* Tabla con scroll */}
            {filteredInventario.length > 0 && (
                <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                    <h2 style={{ color: '#38bdf8', marginBottom: '10px' }}>Listado Detallado del Inventario</h2>
                    <table className="tabla-hospitalaria" id={INVENTORY_TABLE_ID}>
                        <thead>
                            <tr>
                                <th>Clave CB</th>
                                <th>Descripción</th>
                                <th>Presentación</th>
                                <th>Total Disponible</th>
                                <th>Días para Caducar</th>
                                <th>Semáforo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventario.map(item => {
                                const color = getExpirationStatus(item.diasParaVencer);
                                return (
                                    <tr key={item.claveCB}>
                                        <td>{item.claveCB}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{item.presentacion}</td>
                                        <td style={{ textAlign: 'center' }}>{Number(item.totalEnzimas) || 0}</td>
                                        <td style={{ textAlign: 'center' }}>{item.diasParaVencer ?? 'N/A'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    backgroundColor: color,
                                                    border: '1px solid #ccc'
                                                }}
                                            ></span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InventarioGlobal;
