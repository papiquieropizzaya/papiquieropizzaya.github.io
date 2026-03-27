import { auth, db, onAuthStateChanged, signOut, collection, query, orderBy, onSnapshot, updateDoc, doc } from './firebase.js';

let cargaInicial = true; 
const audio = document.getElementById("audioNotificacion");



// Verificar autenticación
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        cargarPedidos();
    }
});

document.getElementById('btnLogout').addEventListener('click', () => {
    signOut(auth);
});

// Función para actualizar estado (La hacemos global para llamarla desde el HTML)
window.cambiarEstado = async (idPedido, nuevoEstado) => {
    try {
        const pedidoRef = doc(db, "pedidos", idPedido);
        await updateDoc(pedidoRef, {
            estado: nuevoEstado
        });
        // No necesitamos recargar, onSnapshot lo hará solo
    } catch (error) {
        console.error("Error actualizando estado:", error);
        alert("Error al actualizar el estado");
    }
};

function cargarPedidos() {
    const contenedor = document.getElementById('listaPedidos');
    const q = query(collection(db, "pedidos"), orderBy("fechaCreacion", "desc"));

    // Escuchar cambios en tiempo real
    onSnapshot(q, (snapshot) => {
        contenedor.innerHTML = '';
        
        if(snapshot.empty) {
            contenedor.innerHTML = '<p style="text-align:center">No hay pedidos aún.</p>';
            return;
        }

        const pedidosHoy = [];
        const pedidosAnteriores = [];
        const hoyString = new Date().toDateString(); // Ejemplo: "Fri Dec 21 2025"

        snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Guardamos ID para usarlo luego
            
            // Validar fecha
            let fechaObj = data.fechaCreacion ? data.fechaCreacion.toDate() : new Date();
            
            // Comparar si es hoy
            if (fechaObj.toDateString() === hoyString) {
                pedidosHoy.push(data);
            } else {
                pedidosAnteriores.push(data);
            }
        });

        // --- Renderizar Sección HOY ---
        let htmlContent = '<h2 class="section-title">📅 Pedidos de Hoy</h2>';
        
        if (pedidosHoy.length === 0) {
            htmlContent += '<p class="no-pedidos">✅ Hoy no hay pedidos pendientes.</p>';
        } else {
            htmlContent += `<div class="pedidos-grid">`;
            pedidosHoy.forEach(p => htmlContent += crearTarjetaHTML(p));
            htmlContent += `</div>`;
        }

        // --- Renderizar Sección ANTERIORES ---
        if (pedidosAnteriores.length > 0) {
            htmlContent += '<h2 class="section-title" style="margin-top:40px;">🗄️ Pedidos Anteriores</h2>';
            htmlContent += `<div class="pedidos-grid">`;
            pedidosAnteriores.forEach(p => htmlContent += crearTarjetaHTML(p));
            htmlContent += `</div>`;
        }

        contenedor.innerHTML = htmlContent;
    });
}

function crearTarjetaHTML(data) {
    const fecha = data.fechaCreacion ? data.fechaCreacion.toDate().toLocaleString() : 'Reciente';
    
    // Items del pedido
    let itemsHtml = '';
    if (data.items) {
        data.items.forEach(item => {
            itemsHtml += `<li><strong>${item.tipo.toUpperCase()}:</strong> ${item.detalle} ${item.sabores ? `(${item.sabores})` : ''}</li>`;
        });
    }

    // Mapa Link
    let gpsLink = '';
    if(data.cliente.gps) {
        gpsLink = `<a href="${data.cliente.gps}" target="_blank" style="color:#ce2c22"><i class="fas fa-map-marker-alt"></i> Ver Mapa GPS</a>`;
    }

    // Definir color del select según el estado actual
    const esRealizado = data.estado === 'Realizado';
    const selectClass = esRealizado ? 'status-select realizado' : 'status-select nuevo';

    return `
        <div class="pedido-card">
            <div class="pedido-header">
                <span class="pedido-id">#${data.id.slice(-5).toUpperCase()}</span>
                <span class="pedido-time">${fecha}</span>
            </div>
            <div class="pedido-body">
                <div style="margin-bottom: 10px;">
                    <label><strong>Estado:</strong></label>
                    <select onchange="window.cambiarEstado('${data.id}', this.value)" class="${selectClass}">
                        <option value="Nuevo" ${data.estado === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
                        <option value="Realizado" ${data.estado === 'Realizado' ? 'selected' : ''}>Realizado</option>
                    </select>
                </div>

                <p><strong>Total:</strong> ${data.total}</p>
                <p><strong>Teléfono:</strong> <a href="tel:${data.cliente.telefono}">${data.cliente.telefono}</a></p>
                <p><strong>Entrega:</strong> ${data.cliente.metodoEntrega} - ${data.cliente.direccion}</p>
                ${gpsLink}
                <hr>
                <ul style="padding-left: 20px;">${itemsHtml}</ul>
                <p><strong>Notas:</strong> ${data.notas || 'Ninguna'}</p>
            </div>
        </div>
    `;
}

// Variable para evitar sonido al recargar la página


// Escuchando cambios en tiempo real
db.collection("pedidos").orderBy("fecha", "desc").onSnapshot((snapshot) => {
    
    // Detectamos cambios específicos en vez de recargar todo
    snapshot.docChanges().forEach((change) => {
        
        if (change.type === "added") {
            // Renderizar el pedido en HTML (Tu función existente)
            mostrarPedidoEnPantalla(change.doc.data(), change.doc.id); 

            // LOGICA DEL SONIDO:
            // Solo sonar si NO es la carga inicial
            if (!cargaInicial) {
                try {
                    audio.currentTime = 0; // Reiniciar audio
                    audio.play();
                } catch (error) {
                    console.log("El navegador bloqueó el audio. Haz click en la página una vez.");
                }
            }
        }
    });

    // Una vez procesados los pedidos viejos, desactivamos la bandera
    cargaInicial = false; 
});

// NOTA: Los navegadores modernos bloquean el audio automático. 
// El admin debe hacer click en cualquier parte de la página al menos una vez para activar el permiso de audio.