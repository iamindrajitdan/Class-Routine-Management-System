import React, { createContext, useState, useContext } from 'react';

const translations = {
    en: {
        dashboard: "Dashboard",
        routines: "Routines",
        teachers: "Teachers",
        classes: "Classes",
        rooms: "Rooms",
        conflicts: "Conflicts",
        substitutes: "Substitutes",
        optimize: "Optimize",
        reports: "Reports",
        calendar: "Calendar",
        auditLogs: "Audit Logs",
        logout: "Logout",
        subjects: "Subjects",
        lessons: "Lessons",
        addSubject: "Add Subject",
        mapLesson: "Map Lesson",
        code: "Code",
        name: "Name",
        creditHours: "Credit Hours",
        program: "Program",
        actions: "Actions",
        notifications: "Notifications",
        noNotifications: "No notifications",
        markAllRead: "Mark all as read",
        welcome: "Welcome to CRMS"
    },
    bn: {
        dashboard: "ড্যাশবোর্ড",
        routines: "রুটিন",
        teachers: "শিক্ষক",
        classes: "ক্লাস",
        rooms: "রুম",
        conflicts: "দ্বন্দ্ব",
        substitutes: "স্থলাভিষিক্ত",
        optimize: "অপ্টিমাইজ",
        reports: "রিপোর্ট",
        calendar: "ক্যালেন্ডার",
        auditLogs: "অডিট লগ",
        logout: "লগআউট",
        subjects: "বিষয়",
        lessons: "পাঠ",
        addSubject: "বিষয় যোগ করুন",
        mapLesson: "পাঠ ম্যাপ করুন",
        code: "কোড",
        name: "নাম",
        creditHours: "ক্রেডিট আওয়ার",
        program: "প্রোগ্রাম",
        actions: "অ্যাকশন",
        notifications: "বিজ্ঞপ্তি",
        noNotifications: "কোন বিজ্ঞপ্তি নেই",
        markAllRead: "সব পঠিত হিসেবে চিহ্নিত করুন",
        welcome: "CRMS-এ স্বাগতম"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    const t = (key) => {
        return translations[language][key] || key;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
