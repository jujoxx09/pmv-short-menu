export function useAuth() {
  // Cambia user a null / user normal / admin para probar
  return {
    user: { name: "Juan", role: "admin" },
    logout: () => console.log("logout")
  };
}