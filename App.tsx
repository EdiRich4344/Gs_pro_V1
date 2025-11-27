import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from './services/supabaseClient';
// Fix: The Session type is now consistently available from the underlying @supabase/auth-js package, resolving module export issues.
import { type Session } from '@supabase/auth-js';
import { View, Resident, Room, Cot, Payment, Expense, Feedback, Notice, Stats, ResidentView, RoomHistory } from './types';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Residents from './components/Residents';
import Rooms from './components/Rooms';
import Meals from './components/Meals';
import Payments from './components/Payments';
import Settings from './components/Settings';
import BottomNavbar from './components/BottomNavbar';
import Toast from './components/Toast';
import AddResident from './components/AddResident';
import ResidentDetail from './components/ResidentDetail';
import VacatedResidents from './components/VacatedResidents';
import FeedbackPage from './components/Feedback';
import Financials from './components/Financials';
import RecycleBin from './components/RecycleBin';
import ResidentDashboard from './components/ResidentDashboard';
import Chatbot from './components/Chatbot';

// Modals
import { AddRoomModal, AddCotModal, ConfirmationModal } from './components/ActionModals';

const App: React.FC = () => {
    // State management
    const [session, setSession] = useState<Session | null>(null);
    const [residentSession, setResidentSession] = useState<Resident | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<View>('dashboard');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Data states
    const [residents, setResidents] = useState<Resident[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [cots, setCots] = useState<Cot[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [roomHistory, setRoomHistory] = useState<RoomHistory[]>([]);
    const [customLogo, setCustomLogo] = useState<string | null>(null);

    // Sub-view states
    const [editingResident, setEditingResident] = useState<Resident | undefined>(undefined);
    const [viewingResidentId, setViewingResidentId] = useState<number | null>(null);
    const [assigningCotId, setAssigningCotId] = useState<number | null>(null);
    const [addingRoom, setAddingRoom] = useState(false);
    const [addingCotForRoomId, setAddingCotForRoomId] = useState<number | null>(null);
    const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);
    const [deletingCotId, setDeletingCotId] = useState<number | null>(null);
    const [vacatingResidentId, setVacatingResidentId] = useState<number | null>(null);
    const [deletingResidentId, setDeletingResidentId] = useState<number | null>(null);
    const [initialAIPrompt, setInitialAIPrompt] = useState<string>('');
    const [residentView, setResidentView] = useState<ResidentView>('dashboard');

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
    };

    // Auth listener
    useEffect(() => {
        // Fix: Corrected call to getSession which is the standard Supabase v2 API.
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        // Fix: Corrected onAuthStateChange to handle different return shapes across versions and ensure subscription is properly managed.
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const fetchData = useCallback(async () => {
        if (!session && !residentSession) return;
        try {
            const results = await Promise.all([
                supabase.from('residents').select('*').order('name'),
                supabase.from('rooms').select('*').order('name'),
                supabase.from('cots').select('*').order('name'),
                supabase.from('payments').select('*').order('date', { ascending: false }),
                supabase.from('expenses').select('*').order('date', { ascending: false }),
                supabase.from('feedback').select('*').order('date', { ascending: false }),
                supabase.from('notices').select('*').order('date', { ascending: false }),
                supabase.storage.from('public_assets').getPublicUrl('logo.png'),
                supabase.from('room_history').select('*').order('startDate', { ascending: false }),
            ]);
            const [residentsRes, roomsRes, cotsRes, paymentsRes, expensesRes, feedbackRes, noticesRes, logoRes, roomHistoryRes] = results;

            if (residentsRes.error) throw residentsRes.error;
            setResidents(residentsRes.data as Resident[]);
            if (roomsRes.error) throw roomsRes.error;
            setRooms(roomsRes.data as Room[]);
            if (cotsRes.error) throw cotsRes.error;
            setCots(cotsRes.data as Cot[]);
            if (paymentsRes.error) throw paymentsRes.error;
            setPayments(paymentsRes.data as Payment[]);
            if (expensesRes.error) throw expensesRes.error;
            setExpenses(expensesRes.data as Expense[]);
            if (feedbackRes.error) throw feedbackRes.error;
            setFeedback(feedbackRes.data as Feedback[]);
            if (noticesRes.error) throw noticesRes.error;
            setNotices(noticesRes.data as Notice[]);
            
            if (roomHistoryRes.error) {
                console.warn("Could not fetch room history:", roomHistoryRes.error.message);
            } else {
                setRoomHistory(roomHistoryRes.data as RoomHistory[]);
            }

            // Fix: The getPublicUrl method does not return an 'error' property, so checking for it caused a type error.
            // A check for the existence of `publicUrl` is sufficient.
            if (logoRes.data.publicUrl) {
                try {
                  const response = await fetch(logoRes.data.publicUrl);
                  if (response.ok) {
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                      setCustomLogo(reader.result as string);
                    };
                  }
                } catch(e) { console.error("Could not fetch custom logo", e); }
            }
        } catch (error: any) {
            showToast(`Error fetching data: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [session, residentSession]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleResidentLoginSuccess = (resident: Resident) => {
        setResidentSession(resident);
        setResidentView('dashboard');
    };

    const handleLogout = async () => {
        if (session) {
            // Fix: Corrected call to signOut, which is the standard Supabase v2 API.
            await supabase.auth.signOut();
            setSession(null);
        }
        if (residentSession) {
            setResidentSession(null);
        }
        setView('dashboard');
        setResidentView('dashboard');
        showToast('You have been logged out.', 'success');
    };
    
    // CRUD Handlers
    const handleSaveResident = async (residentData: any) => {
        try {
            let originalCotId = null;
            if (residentData.id) { // This is an update
                const existing = residents.find(r => r.id === residentData.id);
                originalCotId = existing?.cotId;

                const { data, error } = await supabase.from('residents').update(residentData).eq('id', residentData.id).select().single();
                if (error) throw error;
                showToast(`${data.name} updated successfully!`, 'success');
            } else { // This is a new resident
                const { data, error } = await supabase.from('residents').insert(residentData).select().single();
                if (error) throw error;
                showToast(`${data.name} added successfully!`, 'success');
            }
            // Update cot assignment
            if (residentData.cotId && residentData.cotId !== originalCotId) {
                await supabase.from('cots').update({ residentId: residentData.id }).eq('id', residentData.cotId);
            }
            if (originalCotId && originalCotId !== residentData.cotId) {
                await supabase.from('cots').update({ residentId: null }).eq('id', originalCotId);
            }
            fetchData();
            navigateTo('residents');
        } catch (error: any) {
            showToast(`Error saving resident: ${error.message}`, 'error');
        }
    };
    
    const handleUpdateResidentStatus = async (residentId: number, status: 'Active' | 'Vacated' | 'Deleted', successMessage: string) => {
        try {
            const residentToUpdate = residents.find(r => r.id === residentId);
            const { error } = await supabase.from('residents').update({ status }).eq('id', residentId);
            if (error) throw error;

            if (status !== 'Active' && residentToUpdate?.cotId) {
                await supabase.from('cots').update({ residentId: null }).eq('id', residentToUpdate.cotId);
            }
            
            showToast(successMessage, 'success');
            fetchData();
        } catch (error: any) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setVacatingResidentId(null);
            setDeletingResidentId(null);
            setViewingResidentId(null);
        }
    };

    const handleAddRoom = async (roomName: string) => {
        try {
            const { error } = await supabase.from('rooms').insert({ name: roomName });
            if (error) throw error;
            showToast(`Room "${roomName}" added successfully.`, 'success');
            fetchData();
        } catch (error: any) { showToast(`Error adding room: ${error.message}`, 'error'); }
        finally { setAddingRoom(false); }
    };
    
    const handleDeleteRoom = async (roomId: number) => {
        try {
            const cotsInRoom = cots.filter(c => c.roomId === roomId && c.residentId !== null);
            if(cotsInRoom.length > 0) {
                showToast('Cannot delete room with occupied cots.', 'error');
                return;
            }
            const { error } = await supabase.from('rooms').delete().eq('id', roomId);
            if (error) throw error;
            showToast('Room deleted successfully.', 'success');
            fetchData();
        } catch (error: any) { showToast(`Error deleting room: ${error.message}`, 'error'); }
        finally { setDeletingRoomId(null); }
    };

    const handleAddCot = async (cotName: string, roomId: number) => {
        try {
            const { error } = await supabase.from('cots').insert({ name: cotName, roomId });
            if (error) throw error;
            showToast(`Cot "${cotName}" added successfully.`, 'success');
            fetchData();
        } catch (error: any) { showToast(`Error adding cot: ${error.message}`, 'error'); }
        finally { setAddingCotForRoomId(null); }
    };

    const handleDeleteCot = async (cotId: number) => {
        try {
            const cotToDelete = cots.find(c => c.id === cotId);
            if(cotToDelete?.residentId) {
                showToast('Cannot delete an occupied cot.', 'error');
                return;
            }
            const { error } = await supabase.from('cots').delete().eq('id', cotId);
            if (error) throw error;
            showToast('Cot deleted successfully.', 'success');
            fetchData();
        } catch (error: any) { showToast(`Error deleting cot: ${error.message}`, 'error'); }
        finally { setDeletingCotId(null); }
    };

    const handleAddPayment = async (paymentData: Omit<Payment, 'id'>) => {
        try {
            const { error } = await supabase.from('payments').insert(paymentData);
            if (error) throw error;
            showToast('Payment added successfully.', 'success');
            fetchData();
        } catch (error: any) { showToast(`Error adding payment: ${error.message}`, 'error'); }
    };

    const handleUpdatePaymentStatus = async (paymentId: number, status: 'Paid' | 'Due' | 'Overdue') => {
        try {
            const { error } = await supabase.from('payments').update({ status }).eq('id', paymentId);
            if (error) throw error;
            showToast('Payment status updated.', 'success');
            fetchData();
        } catch (error: any) { showToast(`Error updating payment: ${error.message}`, 'error'); }
    };

    const handleUpdateFeedbackStatus = async (feedbackId: number, status: 'New' | 'Viewed') => {
        try {
            const { error } = await supabase.from('feedback').update({ status }).eq('id', feedbackId);
            if (error) throw error;
            fetchData();
        } catch(e: any) { showToast(`Error updating feedback: ${e.message}`, 'error'); }
    }
    
    const handleAddFeedback = async (feedbackData: Omit<Feedback, 'id'>) => {
        try {
            const { error } = await supabase.from('feedback').insert(feedbackData);
            if(error) throw error;
            showToast('Feedback submitted successfully!', 'success');
            fetchData();
        } catch(e: any) { showToast(`Error submitting feedback: ${e.message}`, 'error'); }
    }
    
    const handleUpdateMealPlan = async (residentId: number, mealPlan: Resident['mealPlan']) => {
        try {
            const { error } = await supabase.from('residents').update({ mealPlan }).eq('id', residentId);
            if (error) throw error;
            fetchData();
        } catch(e: any) { showToast(`Error updating meal plan: ${e.message}`, 'error'); }
    }

    // Navigation and View Logic
    const navigateTo = (newView: View) => {
        setView(newView);
        setEditingResident(undefined);
        // Reset the viewing resident ID unless we are navigating to the detail page itself.
        if (newView !== 'resident-detail') {
            setViewingResidentId(null);
        }
    };

    const handleAskAI = (prompt: string) => {
        setInitialAIPrompt(prompt);
        navigateTo('chatbot');
    };

    const viewingResident = viewingResidentId ? residents.find(r => r.id === viewingResidentId) : null;
    const stats: Stats = useMemo(() => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const prevMonthDate = new Date(currentDate);
        prevMonthDate.setMonth(currentDate.getMonth() - 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        const filteredPayments = payments.filter(p => {
            const paymentDate = new Date(p.date);
            return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        });
        
        const prevMonthPayments = payments.filter(p => {
            const paymentDate = new Date(p.date);
            return paymentDate.getMonth() === prevMonth && paymentDate.getFullYear() === prevYear;
        });

        const incomeThisMonth = filteredPayments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);
            
        const incomeLastMonth = prevMonthPayments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            totalResidents: residents.filter(r => r.status === 'Active').length,
            occupiedCots: cots.filter(c => c.residentId !== null).length,
            totalCots: cots.length,
            duePayments: filteredPayments.filter(p => p.status === 'Due').length,
            overduePayments: filteredPayments.filter(p => p.status === 'Overdue').length,
            incomeThisMonth,
            incomeLastMonth,
            totalMeals: 0,
        };
    }, [residents, cots, payments, currentDate]);

    const renderAdminView = () => {
        if (view === 'add-resident' || editingResident) {
            return <AddResident onSave={handleSaveResident} onCancel={() => navigateTo(editingResident ? 'resident-detail' : 'residents')} cots={cots} rooms={rooms} residents={residents} existingResident={editingResident} defaultCotId={assigningCotId} />;
        }
        if (view === 'resident-detail' && viewingResident) {
            return <ResidentDetail 
                resident={viewingResident} 
                payments={payments.filter(p => p.residentId === viewingResident.id)} 
                cot={cots.find(c => c.id === viewingResident.cotId) || null} 
                room={rooms.find(r => r.id === cots.find(c => c.id === viewingResident.cotId)?.roomId) || null} 
                roomHistory={roomHistory.filter(h => h.residentId === viewingResident.id)}
                onBack={() => navigateTo('residents')} 
                onEdit={(res) => { setEditingResident(res); }} 
                onVacate={(id) => setVacatingResidentId(id)} 
                onDelete={(id) => setDeletingResidentId(id)} 
                showToast={showToast} 
                customLogo={customLogo} 
            />;
        }

        switch (view) {
            case 'dashboard': return <Dashboard stats={stats} residents={residents} payments={payments} feedback={feedback} navigateTo={navigateTo} onAddResidentClick={() => navigateTo('add-resident')} currentDate={currentDate} onMonthChange={(dir) => setCurrentDate(d => { const newD = new Date(d); newD.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1)); return newD; })} onAskAI={handleAskAI} />;
            case 'residents': return <Residents residents={residents} cots={cots} rooms={rooms} onAddResident={() => navigateTo('add-resident')} onViewResident={(id) => { setViewingResidentId(id); navigateTo('resident-detail'); }} />;
            case 'rooms': return <Rooms rooms={rooms} cots={cots} residents={residents} onViewResident={(id) => { setViewingResidentId(id); navigateTo('resident-detail'); }} onAddRoom={() => setAddingRoom(true)} onAddCot={(roomId) => setAddingCotForRoomId(roomId)} onAssignResident={(cotId) => { setAssigningCotId(cotId); navigateTo('add-resident'); }} showToast={showToast} onDeleteRoom={(id) => setDeletingRoomId(id)} onDeleteCot={(id) => setDeletingCotId(id)} />;
            case 'meals': return <Meals residents={residents} onUpdateMealPlan={handleUpdateMealPlan} />;
            case 'payments': return <Payments payments={payments} residents={residents} showToast={showToast} onAddPayment={handleAddPayment} onUpdatePaymentStatus={handleUpdatePaymentStatus} />;
            case 'settings': return <Settings onLogout={handleLogout} navigateTo={navigateTo} showToast={showToast} customLogo={customLogo} onLogoChange={fetchData}/>;
            case 'vacated-residents': return <VacatedResidents residents={residents.filter(r => r.status === 'Vacated')} onViewResident={(id) => { setViewingResidentId(id); navigateTo('resident-detail'); }} onBack={() => navigateTo('settings')} />;
            case 'feedback': return <FeedbackPage feedback={feedback} onUpdateFeedbackStatus={handleUpdateFeedbackStatus} onBack={() => navigateTo('dashboard')} />;
            case 'financials': return <Financials payments={payments} expenses={expenses} />;
            case 'recycle-bin': return <RecycleBin residents={residents.filter(r => r.status === 'Deleted')} onRestore={(id) => handleUpdateResidentStatus(id, 'Active', 'Resident restored successfully.')} onBack={() => navigateTo('settings')} />;
            case 'chatbot': return <Chatbot onBack={() => navigateTo('dashboard')} initialPrompt={initialAIPrompt} />;
            default: return <Dashboard stats={stats} residents={residents} payments={payments} feedback={feedback} navigateTo={navigateTo} onAddResidentClick={() => navigateTo('add-resident')} currentDate={currentDate} onMonthChange={(dir) => setCurrentDate(d => { const newD = new Date(d); newD.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1)); return newD; })} onAskAI={handleAskAI} />;
        }
    };

    // Render logic
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black">Loading...</div>;
    }
    
    if (residentSession) {
        const residentPayments = payments.filter(p => p.residentId === residentSession.id);
        const residentFeedback = feedback.filter(f => f.residentId === residentSession.id);
        const residentCot = cots.find(c => c.id === residentSession.cotId) || null;
        const residentRoom = residentCot ? rooms.find(r => r.id === residentCot.roomId) : null;
        return (
            <div className="h-screen w-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                <ResidentDashboard resident={residentSession} payments={residentPayments} cot={residentCot} room={residentRoom} feedback={residentFeedback} notices={notices} currentView={residentView} setCurrentView={setResidentView} onLogout={handleLogout} showToast={showToast} customLogo={customLogo} onConfirmPayment={(id) => handleUpdatePaymentStatus(id, 'Paid')} onAddFeedback={handleAddFeedback} />
            </div>
        );
    }
    
    if (!session) {
        return (
            <>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                <Login showToast={showToast} onResidentLoginSuccess={handleResidentLoginSuccess} />
            </>
        );
    }

    const modalViewActive = view === 'add-resident' || editingResident || view === 'resident-detail' || view === 'chatbot';
    const overduePaymentsCount = payments.filter(p => p.status === 'Overdue').length;

    return (
        <div className="h-screen w-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <main className="h-full">
                {renderAdminView()}
            </main>
            
            {/* Modals */}
            {addingRoom && <AddRoomModal onClose={() => setAddingRoom(false)} onSave={handleAddRoom} />}
            {addingCotForRoomId && <AddCotModal onClose={() => setAddingCotForRoomId(null)} onSave={handleAddCot} rooms={rooms} defaultRoomId={addingCotForRoomId} />}
            {deletingRoomId && <ConfirmationModal onClose={() => setDeletingRoomId(null)} onConfirm={() => handleDeleteRoom(deletingRoomId)} title="Delete Room" message="Are you sure you want to delete this room? This action cannot be undone." confirmText="Delete" />}
            {deletingCotId && <ConfirmationModal onClose={() => setDeletingCotId(null)} onConfirm={() => handleDeleteCot(deletingCotId)} title="Delete Cot" message="Are you sure you want to delete this cot? This action cannot be undone." confirmText="Delete" />}
            {vacatingResidentId && <ConfirmationModal onClose={() => setVacatingResidentId(null)} onConfirm={() => handleUpdateResidentStatus(vacatingResidentId, 'Vacated', 'Resident marked as vacated.')} title="Vacate Resident" message="Are you sure you want to vacate this resident? Their cot will become available." confirmText="Vacate" />}
            {deletingResidentId && <ConfirmationModal onClose={() => setDeletingResidentId(null)} onConfirm={() => handleUpdateResidentStatus(deletingResidentId, 'Deleted', 'Resident moved to recycle bin.')} title="Delete Resident" message="Are you sure you want to delete this resident? Their data will be moved to the recycle bin." confirmText="Delete" />}

            {!modalViewActive && <BottomNavbar currentView={view} navigateTo={navigateTo} overduePaymentsCount={overduePaymentsCount} />}
        </div>
    );
};

export default App;