"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useAuthFetch() {
    const authFetch = async <T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> => {
        const token = localStorage.getItem("token");
        
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
            ...(token && { Authorization: `Bearer ${token}` }),
        };
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Errore sconosciuto" }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    };
    
    // Helper methods
    const get = <T>(endpoint: string) => 
        authFetch<T>(endpoint, { method: "GET" });
    
    const post = <T>(endpoint: string, data?: any) =>
        authFetch<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
    
    const put = <T>(endpoint: string, data?: any) =>
        authFetch<T>(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    
    const del = <T>(endpoint: string) =>
        authFetch<T>(endpoint, { method: "DELETE" });
    
    return {
        authFetch,
        get,
        post,
        put,
        delete: del,
    };
}