const config = {
    backendUrl: import.meta.env.VITE_BACKEND_URL || "${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}`}`}"
};

export default config;
