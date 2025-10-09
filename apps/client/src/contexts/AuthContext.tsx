"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoading: boolean; // Alias per compatibilità con ProtectedRoute
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    // Verifica token all'avvio
    useEffect(() => {
        verifyToken();
    }, []);
    
    const verifyToken = async () => {
        const token = localStorage.getItem("token");
        
        console.log("🔍 Verifying token:", token ? "Token found" : "No token");
        
        if (!token) {
            setLoading(false);
            return;
        }
        
        try {
            // Chiama /auth/me per verificare il token
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const userData = await response.json();
                console.log("✅ Token valid, user:", userData);
                setUser(userData);
            } else {
                console.log("❌ Token invalid, clearing...");
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (error) {
            console.error("❌ Error verifying token:", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    const login = async (email: string, password: string) => {
        console.log("🔐 Attempting login for:", email);
        setError(null); // Resetta errore precedente
        setLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || "Login fallito";
                setError(errorMessage);
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log("✅ Login successful:", data);
            
            // Salva solo il token
            localStorage.setItem("token", data.token);
            
            setUser(data.user);
            setError(null);
            
            console.log("🏠 Redirecting to home...");
            router.push("/");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Login fallito";
            console.error("❌ Login error:", errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    const register = async (data: RegisterData) => {
        console.log("📝 Attempting registration for:", data.email);
        setError(null);
        setLoading(true);
        
        try {
            const requestBody = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                role: "USER",
            };
            
            console.log("📤 Request body:", requestBody);
            
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            
            console.log("📥 Response status:", response.status);
            console.log("📥 Response ok:", response.ok);
            
            if (!response.ok) {
                // Get detailed error information
                let errorMessage = "Registrazione fallita";
                try {
                    const responseText = await response.text();
                    console.log("❌ Raw error response:", responseText);
                    
                    if (responseText) {
                        try {
                            const errorData = JSON.parse(responseText);
                            console.log("❌ Parsed error data:", errorData);
                            errorMessage = errorData.message || errorData.error || `Registration failed: ${response.status}`;
                        } catch (parseError) {
                            console.log("❌ Could not parse error as JSON, using text:", responseText);
                            errorMessage = responseText || `Registration failed: ${response.status}`;
                        }
                    }
                } catch (textError) {
                    console.log("❌ Could not read error response:", textError);
                    errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
                }
                
                setError(errorMessage);
                throw new Error(errorMessage);
            }
            
            const responseData = await response.json();
            console.log("✅ Registration successful:", responseData);
            
            localStorage.setItem("token", responseData.token);
            setUser(responseData.user);
            setError(null);
            
            console.log("🏠 Redirecting to home...");
            router.push("/");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Registrazione fallita";
            console.error("❌ Registration error:", errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    const logout = () => {
        console.log("🚪 Logging out...");
        
        localStorage.removeItem("token");
        setUser(null);
        setError(null);
        
        router.push("/login");
    };
    
    const clearError = () => {
        setError(null);
    };
    
    return (
        <AuthContext.Provider 
        value={{ 
            user, 
            loading,
            isLoading: loading, // Alias per compatibilità
            error,
            login,
            register,
            logout,
            clearError,
            isAuthenticated: !!user 
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}