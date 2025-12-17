import { db, collection, addDoc, serverTimestamp } from './firebase.js';

window.guardarPedidoEnFirebase = async function() {
    const btn = document.querySelector('.btn-order');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        // 1. Recopilar Datos del Cliente
        const deliveryType = document.getElementById('deliveryType').value;
        const address = document.getElementById('addressInput').value;
        const phone = document.getElementById('phoneInput').value; // Nuevo campo
        const gps = document.getElementById('gpsCoords').value;
        const notes = document.getElementById('extraNotes').value;
        const dateInput = document.getElementById('dateInput').value;
        const isAsap = document.getElementById('asap').checked;
        const totalText = document.getElementById('displayTotal').innerText.split('\n')[0];

        // 2. Recopilar Productos (Lógica extraída de tu script original)
        let items = [];

        // Pizzas
        document.querySelectorAll('.pizza-block').forEach((block, index) => {
            const sizeVal = block.querySelector('.pizza-size').value;
            if(sizeVal) {
                const flavors = [];
                block.querySelectorAll('.flavor-select').forEach(sel => { if(sel.value) flavors.push(sel.value); });
                if(flavors.length > 0) {
                    items.push({
                        tipo: 'Pizza',
                        detalle: `Pizza #${index+1} (${sizeVal})`,
                        sabores: flavors.join(' / ')
                    });
                }
            }
        });

        // Otros Items
        document.querySelectorAll('.item-select').forEach(sel => {
            if(sel.value) {
                items.push({
                    tipo: sel.dataset.type, // burger, dog, salchipapa
                    detalle: sel.value
                });
            }
        });

        if(items.length === 0) {
            throw new Error("El pedido está vacío");
        }

        // 3. Crear Objeto del Pedido
        const pedido = {
            cliente: {
                telefono: phone || "No especificado",
                direccion: deliveryType === 'delivery' ? address : 'Recoge en Local',
                gps: gps || null,
                metodoEntrega: deliveryType
            },
            items: items,
            notas: notes,
            horario: isAsap ? "Lo más rápido posible" : dateInput,
            total: totalText,
            fechaCreacion: serverTimestamp(),
            estado: "Nuevo" // Para el admin panel
        };

        // 4. Guardar en Firestore
        await addDoc(collection(db, "pedidos"), pedido);

        alert("✅ ¡Pedido recibido! Empezaremos a prepararlo.");
        window.location.reload(); // Reiniciar formulario

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error: " + error.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
};