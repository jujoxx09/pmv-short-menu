import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, getDocs, serverTimestamp, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import "./AdminPage.css";

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
  const [editingId, setEditingId] = useState(null); // ID del plato que estamos editando
  const [platos, setPlatos] = useState([]); // Lista de platos
  const [codigo, setCodigo] = useState("");
  const [codigos, setCodigos] = useState([]);
  const [puntosCodigo, setPuntosCodigo] = useState(10);
  const [cantidadCodigos, setCantidadCodigos] = useState(1);

  const CLOUD_NAME = "dpl5gkoyi";
  const UPLOAD_PRESET = "videosProyect";


  const fetchCodigos = async () => {
  const snapshot = await getDocs(collection(db, "codigos"));
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setCodigos(data);
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

    </div>
  );
}