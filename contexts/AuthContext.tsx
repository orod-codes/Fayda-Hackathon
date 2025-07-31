"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

export type UserRole = "patient" | "doctor" | "hospital-admin" | "super-admin";

interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	hospitalId?: string;
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (userData: User) => void;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check for stored user data on app load
		const storedUser = localStorage.getItem("hakim_user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error("Error parsing stored user data:", error);
				localStorage.removeItem("hakim_user");
			}
		}
		setIsLoading(false);
	}, []);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem("hakim_user", JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("hakim_user");
		localStorage.removeItem("accessToken");
	};

	const isAuthenticated = !!user;

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, login, logout, isLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
