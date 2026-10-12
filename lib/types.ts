export interface User {
    id: number;
    name: string;
    email: string;
    role: 'contributor' | 'maintainer';
    created_at: string;
    updated_at: string;
  }
  
  export interface Issue {
    id: number;
    title: string;
    description: string;
    type: 'bug' | 'feature_request';
    status: 'open' | 'in_progress' | 'resolved';
    reporter: {
      id: number;
      name: string;
      role: string;
    };
    created_at: string;
    updated_at: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
      token: string;
      user: User;
    };
  }
  
  export interface SignupResponse {
    success: boolean;
    message: string;
    data: User;
  }
  
  export interface IssueResponse {
    success: boolean;
    message: string;
    data: Issue | Issue[];
  }
  
  export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  }