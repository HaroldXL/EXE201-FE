import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: "https://prjapi-bya9f9bzb3chgkaf.southeastasia-01.azurewebsites.net/api/", 
});

// Check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        
        // Check if token is expired
        if (decodedToken.exp < currentTime) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

// Logout function
const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Dispatch custom event to notify app about logout
    window.dispatchEvent(new Event("logout"));
    
    // Redirect to login page
    window.location.href = "/login";
};

const handleBefore = (config) => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    
    // Only check token expiration if not login/register endpoint
    const isAuthEndpoint = config.url?.includes("User/login") || 
                           config.url?.includes("User/register") ||
                           config.url?.includes("User/signup");
    
    // Check if token is expired before making request (except for auth endpoints)
    if (!isAuthEndpoint && token && isTokenExpired(token)) {
        handleLogout();
        return Promise.reject(new Error("Token expired"));
    }
    
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
};
  
const handleError = (error) => {
    console.log(error);
    return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

// Add response interceptor to handle 401 errors from backend
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Get the request URL to check if it's login/register endpoint
        const requestUrl = error.config?.url || "";
        
        // Don't auto-logout for login/register endpoints
        const isAuthEndpoint = requestUrl.includes("User/login") || 
                               requestUrl.includes("User/register") ||
                               requestUrl.includes("User/signup");
        
        // If backend returns 401 and it's not an auth endpoint, logout
        if (error.response && error.response.status === 401 && !isAuthEndpoint) {
            handleLogout();
        }
        
        return Promise.reject(error);
    }
);

export default api;
