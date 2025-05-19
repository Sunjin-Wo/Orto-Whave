function getDevelopmentCredentials() {
  // Lógica actual de useDevelopmentCredentials pero sin usar otros hooks
  return { email: 'test@example.com', password: 'password123' };
}

const login = async (email, password) => {
  try {
    // Línea 77 - Reemplaza esto:
    // const credentials = useDevelopmentCredentials();
    
    // Con esto:
    const credentials = getDevelopmentCredentials();
    
    // ... existing code ...
    
    // Línea 88 - Hacer el mismo cambio aquí
    // const credentials = useDevelopmentCredentials();
    
    // Con esto:
    const credentials = getDevelopmentCredentials();
    
    // ... existing code ...
  } catch (error) {
    // ... existing code ...
  }
}; 