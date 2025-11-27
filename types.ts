// Fix: The Session type is now consistently available from the underlying @supabase/auth-js package, resolving module export issues.
import { type Session } from '@supabase/auth-js';

export type View = 'dashboard' | 'residents' | 'rooms' | 'meals' | 'payments' | 'settings' | 'resident-detail' | 'add-resident' | 'vacated-residents' | 'feedback' | 'financials' | 'recycle-bin' | 'chatbot';
export type ResidentView = 'dashboard' | 'profile' | 'feedback' | 'payment-flow' | 'payment-success' | 'notices' | 'rules' | 'payments';

export interface Resident {
    id: number;
    user_id: string | null;
    role: 'admin' | 'resident';
    name: string;
    dateOfBirth: string | null;
    type: 'Student' | 'Working Women';
    phone: string | null;
    email: string;
    guardianName: string | null;
    guardianPhone: string | null;
    aadhaarNumber: string | null;
    cotId: number | null;
    rent: number;
    depositAmount: number;
    mealPlan: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
    };
    status: 'Active' | 'Vacated' | 'Deleted';
}

export interface Room {
    id: number;
    name: string;
}

export interface Cot {
    id: number;
    name: string;
    roomId: number;
    residentId: number | null;
}

export interface RoomHistory {
    id: number;
    residentId: number;
    roomName: string;
    cotName: string;
    startDate: string;
    endDate: string | null;
}

export interface Payment {
    id: number;
    residentId: number;
    amount: number;
    date: string;
    status: 'Paid' | 'Due' | 'Overdue';
    description: string;
}

export interface Expense {
    id: number;
    date: string;
    category: 'Food Supplies' | 'Utilities' | 'Maintenance' | 'Staff Salary' | 'Miscellaneous';
    description: string;
    amount: number;
}


export interface Stats {
    totalResidents: number;
    occupiedCots: number;
    totalCots: number;
    duePayments: number;
    overduePayments: number;
    incomeThisMonth: number;
    incomeLastMonth: number;
    totalMeals: number;
}

export interface Feedback {
    id: number;
    residentId: number;
    residentName: string;
    message: string;
    date: string;
    status: 'New' | 'Viewed';
    category: 'General' | 'Complaint' | 'Request';
}

export interface Notice {
    id: number;
    title: string;
    content: string;
    date: string;
}