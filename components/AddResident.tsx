import React, { useState, useEffect } from 'react';
import { Resident, Cot, Room } from '../types';
import { ArrowLeftIcon, UserCircleIcon, PhoneIcon, BuildingIcon, ClipboardCheckIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface AddResidentProps {
    onSave: (resident: any) => void;
    onCancel: () => void;
    cots: Cot[];
    rooms: Room[];
    residents: Resident[];
    existingResident?: Resident;
    defaultCotId?: number | null;
}

const TOTAL_STEPS = 4;

const AddResident: React.FC<AddResidentProps> = ({ onSave, onCancel, cots, rooms, existingResident, defaultCotId }) => {
    const [step, setStep] = useState(1);
    const [animation, setAnimation] = useState('animate-page-in');
    
    const [resident, setResident] = useState<Omit<Resident, 'id' | 'user_id' | 'role' | 'status'>>({
        name: '',
        dateOfBirth: '',
        type: 'Student',
        phone: '',
        email: '',
        guardianName: '',
        guardianPhone: '',
        aadhaarNumber: '',
        cotId: defaultCotId || null,
        rent: 8000,
        depositAmount: 16000,
        mealPlan: { breakfast: true, lunch: true, dinner: true },
    });

    useEffect(() => {
        if (existingResident) {
            setResident({
                ...existingResident,
                dateOfBirth: existingResident.dateOfBirth ? existingResident.dateOfBirth.split('T')[0] : '',
            });
        }
    }, [existingResident]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResident(prev => ({ ...prev, [name]: value }));
    };
    
    const handleMealPlanChange = (meal: 'breakfast' | 'lunch' | 'dinner') => {
        setResident(prev => ({
            ...prev,
            mealPlan: { ...prev.mealPlan, [meal]: !prev.mealPlan[meal] },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...resident,
            cotId: resident.cotId ? Number(resident.cotId) : null,
            rent: Number(resident.rent),
            depositAmount: Number(resident.depositAmount),
        };
        
        if (existingResident) {
            onSave({ ...existingResident, ...dataToSave });
        } else {
            onSave({ ...dataToSave, role: 'resident', status: 'Active' });
        }
    };
    
    const nextStep = () => {
        if (step < TOTAL_STEPS) {
             setAnimation('animate-page-out-right');
             setTimeout(() => {
                 setStep(s => s + 1);
                 setAnimation('animate-page-in');
             }, 200);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setAnimation('animate-page-out-right');
            setTimeout(() => {
                setStep(s => s - 1);
                setAnimation('animate-page-in-left');
            }, 200);
        }
    };

    const availableCots = cots.filter(cot => cot.residentId === null || (existingResident && cot.residentId === existingResident.id));

    const inputClass = "w-full p-3 border-2 border-light-outline/50 dark:border-dark-outline/50 rounded-xl bg-light-surface-variant/30 dark:bg-dark-surface-variant/30 text-light-on-surface-variant dark:text-dark-on-surface-variant placeholder:text-light-on-surface-variant/60 dark:placeholder:text-dark-on-surface-variant/60 focus:border-light-primary dark:focus:border-dark-primary focus:ring-0 transition-colors";
    const labelClass = "block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1";
    const progress = (step / TOTAL_STEPS) * 100;
    
    const renderStep = () => {
        switch(step) {
            case 1: return <Step1 resident={resident} handleChange={handleChange} labelClass={labelClass} inputClass={inputClass} setResident={setResident} />;
            case 2: return <Step2 resident={resident} handleChange={handleChange} labelClass={labelClass} inputClass={inputClass} />;
            case 3: return <Step3 resident={resident} handleChange={handleChange} handleMealPlanChange={handleMealPlanChange} labelClass={labelClass} inputClass={inputClass} availableCots={availableCots} rooms={rooms} />;
            case 4: return <Step4 resident={resident} cots={cots} rooms={rooms} />;
            default: return null;
        }
    }

    const stepTitles = ["Personal Info", "Contact Info", "Hostel Setup", "Review & Save"];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md">
                <div className="flex items-center">
                    <button type="button" onClick={() => {
                            triggerHapticFeedback();
                            onCancel();
                        }} className="mr-2 p-2 rounded-full hover:bg-light-surface-variant dark:hover:bg-dark-surface-variant transition-colors">
                        <ArrowLeftIcon className="w-6 h-6 text-light-on-surface dark:text-dark-on-surface" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-light-on-surface dark:text-dark-on-surface">{existingResident ? 'Edit Resident' : 'Add New Resident'}</h1>
                        <p className="text-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">{`Step ${step} of ${TOTAL_STEPS}: ${stepTitles[step-1]}`}</p>
                    </div>
                </div>
                <div className="w-full bg-light-surface-variant dark:bg-dark-surface-variant rounded-full h-1.5 mt-3">
                    <div className="bg-light-primary dark:bg-dark-primary h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto">
                <div className={`${animation}`}>
                    {renderStep()}
                </div>
            </main>

            <footer className="sticky bottom-0 p-4 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-t border-light-outline/30 dark:border-dark-outline/30">
                <div className="flex justify-between items-center">
                    <button 
                        type="button" 
                        onClick={prevStep}
                        disabled={step === 1}
                        className="px-6 py-3 rounded-xl bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold disabled:opacity-50"
                    >
                        Back
                    </button>
                    {step < TOTAL_STEPS ? (
                        <button 
                            type="button" 
                            onClick={nextStep}
                            className="px-6 py-3 rounded-xl bg-light-primary dark:bg-dark-primary text-white font-semibold"
                        >
                            Next
                        </button>
                    ) : (
                         <button 
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-green-600 dark:bg-green-500 text-white font-semibold"
                        >
                            {existingResident ? 'Save Changes' : 'Save Resident'}
                        </button>
                    )}
                </div>
            </footer>
        </form>
    );
};

// --- STEP 1: PERSONAL INFO ---
const Step1 = ({ resident, handleChange, labelClass, inputClass, setResident }) => (
    <div className="p-4 space-y-6">
        <SectionWrapper icon={UserCircleIcon} title="Personal Details">
            <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" name="name" value={resident.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={resident.dateOfBirth || ''} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label className={labelClass}>Resident Type</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <button type="button" onClick={() => setResident(prev => ({ ...prev, type: 'Student' }))} className={`p-3 rounded-lg text-sm font-semibold border-2 transition-colors ${resident.type === 'Student' ? 'bg-light-primary text-white border-light-primary dark:bg-dark-primary dark:border-dark-primary' : 'bg-transparent border-light-outline/50 dark:border-dark-outline/50'}`}>Student</button>
                        <button type="button" onClick={() => setResident(prev => ({ ...prev, type: 'Working Women' }))} className={`p-3 rounded-lg text-sm font-semibold border-2 transition-colors ${resident.type === 'Working Women' ? 'bg-light-primary text-white border-light-primary dark:bg-dark-primary dark:border-dark-primary' : 'bg-transparent border-light-outline/50 dark:border-dark-outline/50'}`}>Working</button>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    </div>
);


// --- STEP 2: CONTACT INFO ---
const Step2 = ({ resident, handleChange, labelClass, inputClass }) => (
    <div className="p-4 space-y-6">
         <SectionWrapper icon={PhoneIcon} title="Contact & Guardian">
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" name="phone" value={resident.phone || ''} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" name="email" value={resident.email} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Guardian's Name</label>
                    <input type="text" name="guardianName" value={resident.guardianName || ''} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Guardian's Phone</label>
                    <input type="tel" name="guardianPhone" value={resident.guardianPhone || ''} onChange={handleChange} className={inputClass} />
                </div>
            </div>
             <div>
                <label className={labelClass}>Aadhaar Number</label>
                <input type="text" name="aadhaarNumber" value={resident.aadhaarNumber || ''} onChange={handleChange} className={inputClass} />
            </div>
        </SectionWrapper>
    </div>
);

// --- STEP 3: HOSTEL SETUP ---
const Step3 = ({ resident, handleChange, handleMealPlanChange, labelClass, inputClass, availableCots, rooms }) => (
    <div className="p-4 space-y-6">
        <SectionWrapper icon={BuildingIcon} title="Hostel Setup">
            <div>
                <label className={labelClass}>Assign Cot</label>
                 <select name="cotId" value={resident.cotId || ''} onChange={handleChange} className={inputClass}>
                    <option value="">Not Assigned</option>
                    {availableCots.map(cot => {
                        const room = rooms.find(r => r.id === cot.roomId);
                        return <option key={cot.id} value={cot.id}>{room?.name} - {cot.name}</option>
                    })}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Monthly Rent (₹)</label>
                    <input type="number" name="rent" value={resident.rent} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Security Deposit (₹)</label>
                    <input type="number" name="depositAmount" value={resident.depositAmount} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label className={labelClass}>Meal Plan</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                    {(['breakfast', 'lunch', 'dinner'] as const).map(meal => (
                        <button key={meal} type="button" onClick={() => handleMealPlanChange(meal)} className={`p-3 rounded-lg text-sm font-semibold border-2 transition-colors capitalize ${resident.mealPlan[meal] ? 'bg-light-primary text-white border-light-primary dark:bg-dark-primary dark:border-dark-primary' : 'bg-transparent border-light-outline/50 dark:border-dark-outline/50'}`}>
                            {meal}
                        </button>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    </div>
);

// --- STEP 4: REVIEW ---
const Step4 = ({ resident, cots, rooms }) => {
    const assignedCot = cots.find(c => c.id === resident.cotId);
    const assignedRoom = assignedCot ? rooms.find(r => r.id === assignedCot.roomId) : null;
    return (
        <div className="p-4 space-y-6">
            <SectionWrapper icon={ClipboardCheckIcon} title="Review Details">
                <ReviewItem label="Full Name" value={resident.name} />
                <ReviewItem label="Date of Birth" value={resident.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString() : 'N/A'} />
                <ReviewItem label="Resident Type" value={resident.type} />
                <hr className="border-light-outline/30 dark:border-dark-outline/30" />
                <ReviewItem label="Phone" value={resident.phone} />
                <ReviewItem label="Email" value={resident.email} />
                <ReviewItem label="Guardian" value={`${resident.guardianName || 'N/A'} (${resident.guardianPhone || 'N/A'})`} />
                <hr className="border-light-outline/30 dark:border-dark-outline/30" />
                <ReviewItem label="Assigned Cot" value={assignedRoom && assignedCot ? `${assignedRoom.name}, ${assignedCot.name}` : 'Not Assigned'} />
                <ReviewItem label="Monthly Rent" value={`₹${Number(resident.rent).toLocaleString('en-IN')}`} />
                <ReviewItem label="Security Deposit" value={`₹${Number(resident.depositAmount).toLocaleString('en-IN')}`} />
                 <ReviewItem label="Meal Plan" value={Object.entries(resident.mealPlan).filter(([,v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')} />
            </SectionWrapper>
        </div>
    );
};

const SectionWrapper: React.FC<{icon: React.FC<{className?: string}>, title: string, children: React.ReactNode}> = ({ icon: Icon, title, children }) => (
    <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-3xl border border-light-outline/20 dark:border-dark-outline/20">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-light-primary-container dark:bg-dark-primary-container flex items-center justify-center">
                <Icon className="w-5 h-5 text-light-on-primary-container dark:text-dark-on-primary-container" />
            </div>
            <h2 className="text-lg font-bold text-light-on-surface dark:text-dark-on-surface">{title}</h2>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const ReviewItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <p className="text-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">{label}</p>
        <p className="font-semibold text-light-on-surface dark:text-dark-on-surface">{value}</p>
    </div>
);


export default AddResident;