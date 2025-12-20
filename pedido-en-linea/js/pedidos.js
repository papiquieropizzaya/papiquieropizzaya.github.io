import { auth, db, onAuthStateChanged, signOut, collection, query, orderBy, onSnapshot } from './firebase.js';

// Verificar autenticación
//onAuthStateChanged(auth, (user) => {
//    if (!user) {
//        window.location.href = "login.html"; // Si no está logueado, fuera
//    } else {
//        cargarPedidos();
//    }
//});

document.getElementById('btnLogout').addEventListener('click', () => {
    signOut(auth);
});

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

        snapshot.forEach((doc) => {
            const data = doc.data();
            const fecha = data.fechaCreacion ? data.fechaCreacion.toDate().toLocaleString() : 'Reciente';
            
            // Construir HTML de los items
            let itemsHtml = '';
            data.items.forEach(item => {
                itemsHtml += `<li><strong>${item.tipo.toUpperCase()}:</strong> ${item.detalle} ${item.sabores ? `(${item.sabores})` : ''}</li>`;
            });

            // Mapa Link
            let gpsLink = '';
            if(data.cliente.gps) {
                gpsLink = `<a href="${data.cliente.gps}" target="_blank" style="color:red"><i class="fas fa-map-marker-alt"></i> Ver Mapa GPS</a>`;
            }

            const card = document.createElement('div');
            card.className = 'pedido-card';
            card.innerHTML = `
                <div class="pedido-header">
                    <span class="pedido-id">#${doc.id.slice(-5).toUpperCase()}</span>
                    <span class="pedido-time">${fecha}</span>
                </div>
                <div class="pedido-body">
                    <p><strong>Estado:</strong> <span style="background:#28a745; color:white; padding:2px 6px; border-radius:4px;">${data.estado}</span></p>
                    <p><strong>Total:</strong> ${data.total}</p>
                    <p><strong>Teléfono:</strong> <a href="tel:${data.cliente.telefono}">${data.cliente.telefono}</a></p>
                    <p><strong>Entrega:</strong> ${data.cliente.metodoEntrega} - ${data.cliente.direccion}</p>
                    ${gpsLink}
                    <hr>
                    <ul style="padding-left: 20px;">${itemsHtml}</ul>
                    <p><strong>Notas:</strong> ${data.notas || 'Ninguna'}</p>
                </div>
            `;
            contenedor.appendChild(card);
        });
    });

}
