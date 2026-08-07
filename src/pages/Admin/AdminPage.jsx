import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, getDocs, serverTimestamp, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import "./AdminPage.css";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AdminPage() {
  const [tab, setTab] = useState("platos");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    allergens: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  // ID del plato que estamos editando
  const [editingId, setEditingId] = useState(null); 
  // Lista de platos
  const [platos, setPlatos] = useState([]); 

  // Reservas
  const [reservas, setReservas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const formatDate = (date) => {

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

  // Pedidos
  const [pedidos, setPedidos] = useState([]);



  // Códigos
  const [codigo, setCodigo] = useState("");
  const [codigos, setCodigos] = useState([]);
  const [puntosCodigo, setPuntosCodigo] = useState(10);
  const [cantidadCodigos, setCantidadCodigos] = useState(1);

  const CLOUD_NAME = "dpl5gkoyi";
  const UPLOAD_PRESET = "videosProyect";

  // =========================
  // 🔥 FETCH CÓDIGOS
  // =========================

  const fetchCodigos = async () => {
  const snapshot = await getDocs(collection(db, "codigos"));
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setCodigos(data);
};

  // =========================
  // 🔥 FETCH RESERVAS
  // =========================
  const fetchReservas = async () => {
    const snapshot = await getDocs(collection(db, "reservas"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ordenar más recientes primero
    data.sort((a, b) => b.createdAt - a.createdAt);

    setReservas(data);
  };

  //Para ver el calendario en la pestaña de reservas

  const tieneReservas = (date) => {

    const formatted = formatDate(date);

    return reservas.some(
      (r) => r.fecha === formatted
    );
  };

  const reservasDelDia = reservas.filter(
    (r) =>
      r.fecha === formatDate(selectedDate)
  );

    // =========================
  // 🔥 FETCH PEDIDOS
  // =========================

  const fetchPedidos = async () => {
  const snapshot = await getDocs(collection(db, "pedidos"));

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // más recientes primero
  data.sort((a, b) => b.createdAt - a.createdAt);

  setPedidos(data);
};



  const generarCodigo = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const handleCreateCodigo = async () => {
  if (!codigo) return alert("Introduce un código");

  try {
    await setDoc(doc(db, "codigos", codigo), {
      puntos: Number(puntosCodigo),
      usado: false,
      createdAt: serverTimestamp(),
    });

    alert("✅ Código creado");
    setCodigo("");
  } catch (error) {
    console.error(error);
    alert("❌ Error creando código");
  }
  fetchCodigos();
};

const handleGenerateCodigos = async () => {
  try {
    for (let i = 0; i < cantidadCodigos; i++) {
      const newCode = generarCodigo();

      await setDoc(doc(db, "codigos", newCode), {
        puntos: Number(puntosCodigo),
        usado: false,
        createdAt: serverTimestamp(),
      });
    }

    alert(`✅ ${cantidadCodigos} códigos generados`);
  } catch (error) {
    console.error(error);
    alert("❌ Error generando códigos");
  }
  fetchCodigos();
};

  // 🔹 Cargar platos desde Firestore
  const fetchPlatos = async () => {
    const snapshot = await getDocs(collection(db, "platos"));
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setPlatos(data);
  };

  useEffect(() => {
    fetchPlatos();
    fetchCodigos();
    fetchReservas();
    fetchPedidos(); 

  }, []);

  // 🔹 Manejar inputs de texto
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Editar plato
  const handleEdit = (plato) => {
    setForm({
      name: plato.name,
      description: plato.description,
      price: plato.price,
      category: plato.category,
      allergens: plato.allergens.join(", ")
    });
    setPreview(plato.videoUrl || null);
    setEditingId(plato.id);
    setTab("platos");
  };

  // 🔹 Eliminar plato
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este plato?")) return;

    await deleteDoc(doc(db, "platos", id));
    alert("✅ Plato eliminado");
    setPlatos(platos.filter(p => p.id !== id));
  };

  // Eliminar reserva

    const handleDeleteReserva = async (id) => {

    if (!confirm("¿Eliminar reserva?")) return;

    try {

      await deleteDoc(doc(db, "reservas", id));

      setReservas(
        reservas.filter((r) => r.id !== id)
      );

      alert("✅ Reserva eliminada");

    } catch (error) {
      console.error(error);
      alert("❌ Error eliminando reserva");
    }
  };

  //Cambiar estado del pedido

  const cambiarEstadoPedido = async (id, estado) => {
  const ref = doc(db, "pedidos", id);

  await updateDoc(ref, {
    estado
  });

  fetchPedidos();
};

  // 🔹 Crear o actualizar plato
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file && !editingId) return alert("Selecciona un vídeo");

    setUploading(true);
    setProgress(0);

    try {
      let videoUrl = preview; // mantiene el vídeo actual si está editando

      // 📤 Subir vídeo a Cloudinary si hay archivo nuevo
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "platos");
        formData.append("resource_type", "video");
        formData.append("tags", form.category);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        });

        xhr.onload = async () => {
          const data = JSON.parse(xhr.response);
          videoUrl = data.secure_url;

          // 🔄 Guardar o actualizar plato en Firestore
          if (editingId) {
            const docRef = doc(db, "platos", editingId);
            await updateDoc(docRef, {
              name: form.name,
              description: form.description,
              price: Number(form.price),
              category: form.category.toLowerCase().trim(),
              allergens: form.allergens
                ? form.allergens.split(",").map(a => a.trim())
                : [],
              videoUrl
            });
            alert("✅ Plato actualizado");
            setEditingId(null);
          } else {
            await addDoc(collection(db, "platos"), {
              name: form.name,
              description: form.description,
              price: Number(form.price),
              category: form.category.toLowerCase().trim(),
              allergens: form.allergens
                ? form.allergens.split(",").map(a => a.trim())
                : [],
              videoUrl,
              createdAt: serverTimestamp()
            });
            alert("✅ Plato creado correctamente");
          }

          // 🔄 Reset formulario
          setForm({ name: "", description: "", price: "", category: "", allergens: "" });
          setFile(null);
          setPreview(null);
          setProgress(0);
          setUploading(false);
          fetchPlatos();
        };

        xhr.onerror = () => {
          alert("❌ Error subiendo vídeo");
          setUploading(false);
        };

        xhr.send(formData);
      } else if (editingId) {
        // Editar plato sin cambiar vídeo
        const docRef = doc(db, "platos", editingId);
        await updateDoc(docRef, {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category.toLowerCase().trim(),
          allergens: form.allergens
            ? form.allergens.split(",").map(a => a.trim())
            : [],
        });
        alert("✅ Plato actualizado");
        setEditingId(null);
        setForm({ name: "", description: "", price: "", category: "", allergens: "" });
        setPreview(null);
        setUploading(false);
        fetchPlatos();
      }

    } catch (error) {
      console.error("🔥 ERROR:", error);
      alert("❌ Error creando/actualizando plato");
      setUploading(false);
    }
  };

  return (
    <div className="admin-container">

      {/* TABS */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === "platos" ? "active" : ""}`}
          onClick={() => {
            setTab("platos");

            // 🔥 RESET SI VIENES EDITANDO
            setEditingId(null);
            setForm({
              name: "",
              description: "",
              price: "",
              category: "",
              allergens: "",
            });

            setFile(null);
            setPreview(null);
            setProgress(0);
          }}
        >
          ➕ Platos
        </button>

        <button
          className={`admin-tab ${tab === "edit" ? "active" : ""}`}
          onClick={() => setTab("edit")}
        >
          ✏️ Gestionar
        </button>

        <button
          className={`admin-tab ${tab === "codes" ? "active" : ""}`}
          onClick={() => setTab("codes")}
        >
          🎟️ Códigos
        </button>
         {/* 🔥 NUEVA TAB */}
        <button
          className={`admin-tab ${tab === "reservas" ? "active" : ""}`}
          onClick={() => setTab("reservas")}
        >
          🍔 Reservas
        </button>

        <button
          className={`admin-tab ${tab === "pedidos" ? "active" : ""}`}
          onClick={() => setTab("pedidos")}
        >
          🛵 Pedidos
        </button>
      </div>

      {/* =========================
          TAB 1 - PLATOS
      ========================= */}
      {tab === "platos" && (
        <form className="admin-form" onSubmit={handleUpload}>

          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
          <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
          <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} />
          <input name="category" placeholder="Categoría" value={form.category} onChange={handleChange} />
          <input name="allergens" placeholder="Alérgenos" value={form.allergens} onChange={handleChange} />

          <input type="file" accept="video/*" onChange={(e) => {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }} />

          {preview && <video src={preview} width="250" controls />}

          {uploading && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          <button type="submit">
            {editingId ? "Actualizar" : "Crear"}
          </button>

        </form>
      )}

      {/* =========================
          TAB 2 - EDITAR
      ========================= */}
      {tab === "edit" && (
        <div className="admin-list">
          {platos.map(p => (
            <div key={p.id} className="admin-card">

              <h3>{p.name}</h3>
              <p>{p.description}</p>

              {p.videoUrl && (
                <video src={p.videoUrl} width="250" controls />
              )}

              <div className="admin-actions">
                <button className="btn-edit" onClick={() => handleEdit(p)}>
                  Editar
                </button>

                <button className="btn-delete" onClick={() => handleDelete(p.id)}>
                  Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* =========================
          TAB 3 - CÓDIGOS
      ========================= */}
      {tab === "codes" && (
        <>
          <div className="admin-form">

            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código" />

            <input type="number" value={puntosCodigo} onChange={(e) => setPuntosCodigo(e.target.value)} />

            <button onClick={handleCreateCodigo}>Crear código</button>

            <input type="number" value={cantidadCodigos} onChange={(e) => setCantidadCodigos(e.target.value)} />

            <button onClick={handleGenerateCodigos}>Generar códigos</button>

          </div>

          <div className="codes-grid">
            {codigos.map(c => (
              <div key={c.id} className="code-card">

                <h3>{c.id}</h3>
                <p>🎯 {c.puntos}</p>

                <p className={`code-status ${c.usado ? "used" : "valid"}`}>
                  {c.usado ? "Usado" : "Disponible"}
                </p>

                <QRCodeCanvas value={c.id} size={120} />

              </div>
            ))}
          </div>
        </>
      )}

            {/* =========================
          TAB RESERVAS
      ========================= */}
{tab === "reservas" && (

  <div className="reservas-admin">

    {/* 📅 CALENDARIO */}
    <div className="calendar-wrapper">

      <Calendar

        onChange={setSelectedDate}

        value={selectedDate}

        tileClassName={({ date, view }) => {

          if (
            view === "month" &&
            tieneReservas(date)
          ) {
            return "has-reservation";
          }

        }}

      />

    </div>

    {/* 🍔 RESERVAS DEL DÍA */}
    <div className="reservas-admin-list">

      <h2>
        Reservas del{" "}
        {selectedDate.toLocaleDateString()}
      </h2>

      {reservasDelDia.length > 0 ? (

        reservasDelDia.map((r) => (

          <div
            key={r.id}
            className="admin-card reserva-card"
          >

            <h3>{r.nombre}</h3>

            <p>📞 {r.telefono}</p>

            <p>📧 {r.email}</p>

            <p>👥 {r.personas} personas</p>

            <p>🕒 {r.hora}</p>

            <button
              className="btn-delete"
              onClick={() =>
                handleDeleteReserva(r.id)
              }
            >
              Eliminar reserva
            </button>

          </div>

        ))

      ) : (

        <p>No hay reservas este día</p>

      )}

    </div>

  </div>

)}

      {tab === "pedidos" && (
        <div className="admin-list">

          {pedidos.map(p => (
            <div key={p.id} className="pedido-card">

              <h3>👤 {p.cliente}</h3>

              <p>📞 {p.telefono}</p>
              <p>📍 {p.direccion}</p>

              <p>💰 Total: {p.total.toFixed(2)}€</p>

              <p>📦 Estado: <strong>{p.estado}</strong></p>

              {/* 🍔 ITEMS */}
              <div className="pedido-items">
                {p.items.map((item, i) => (
                  <div key={i}>

                    <p className="pedido-item">
                      {item.quantity}x {item.name}
                    </p>

                    {item.notes && (
                     <small className="pedido-note">
                        📝 {item.notes}
                      </small>
                    )}

                  </div>
                ))}
              </div>

              {/* 🔥 BOTONES ESTADO */}
              <div className="admin-actions">

                <button onClick={() => cambiarEstadoPedido(p.id, "preparando")}>
                  👨‍🍳 Preparando
                </button>

                <button onClick={() => cambiarEstadoPedido(p.id, "en camino")}>
                  🚗 En camino
                </button>

                <button onClick={() => cambiarEstadoPedido(p.id, "entregado")}>
                  ✅ Entregado
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}