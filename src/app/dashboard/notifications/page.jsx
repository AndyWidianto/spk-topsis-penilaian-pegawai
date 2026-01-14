"use client";
import { fetchWithAuth } from '@/lib/fetcher';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);

    async function getNotifications() {
        try {
            const res = await fetchWithAuth("/api/notifications?limit=15");
            if (res.ok) {
                const resJson = await res.json();
                console.log(resJson);
                setNotifications(resJson.notifications);
                setUnreadCount(resJson.total_unread);
            }
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getNotifications();
    }, []);

    // Tandai notifikasi sebagai dibaca
    async function markAsRead(id) {
        try {
            const data = { id };
            const res = await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify(data) });
            if (res.ok) {
                const resJson = await res.json();
                console.log(resJson);
                setNotifications(notifications.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                ));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Tandai semua sebagai dibaca
    async function markAllAsRead() {
        try {
            const data = { id: "all" };
            const res = await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify(data) });
            if (res.ok) {
                const resJson = await res.json();
                console.log(resJson);
                setNotifications(notifications.map(notif => ({ ...notif, read: true })));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Filter notifikasi berdasarkan tab aktif
    const filteredNotifications = notifications.filter(notif => {
        if (activeTab === 'unread') {
            return !notif.read;
        }
        return true;
    });

    // Dapatkan warna berdasarkan tipe notifikasi
    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            case 'info': return 'bg-blue-100 text-blue-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                            <p className="text-gray-600 mt-1">
                                {unreadCount > 0
                                    ? `Anda memiliki ${unreadCount} notifikasi belum dibaca`
                                    : 'Semua notifikasi telah dibaca'}
                            </p>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg transition-colors ${unreadCount === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            Tandai Semua sebagai Dibaca
                        </button>
                    </div>

                    {/* Tab Menu */}
                    <div className="flex space-x-1 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'all'
                                    ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            Semua
                            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                                {notifications.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('unread')}
                            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'unread'
                                    ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            Unread
                            {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* List Notifikasi */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Tidak ada notifikasi</h3>
                            <p className="text-gray-500">
                                {activeTab === 'unread'
                                    ? 'Tidak ada notifikasi yang belum dibaca'
                                    : 'Belum ada notifikasi untuk ditampilkan'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {filteredNotifications.map(notification => (
                                <Link href={notification.action_url}
                                    key={notification.id}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                    className={`p-4 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${!notification.read
                                            ? 'bg-blue-50 hover:bg-blue-100'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        {/* Indikator Unread */}
                                        {!notification.read && (
                                            <div className="mt-1.5 mr-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}

                                        {/* Icon */}
                                        <div className={`mr-3 p-2 rounded-full ${getTypeColor(notification.type)}`}>
                                            {notification.type === 'success' && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {notification.type === 'error' && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                            {notification.type === 'info' && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            )}
                                            {notification.type === 'warning' && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            )}
                                            {/* {(notification.type === 'announcement' || notification.type === 'reminder') && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      )} */}
                                        </div>

                                        {/* Konten Notifikasi */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.type}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1 text-sm">
                                                        {notification.users.full_name} {notification.message}
                                                    </p>
                                                </div>

                                                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                    {notification.createdAt}
                                                </span>
                                            </div>

                                            {/* Badge tipe notifikasi */}
                                            <div className="mt-2">
                                                <span className={`inline-block px-2 py-1 text-xs rounded ${getTypeColor(notification.type)}`}>
                                                    {notification.type === 'success' && 'Success'}
                                                    {notification.type === 'error' && 'Error'}
                                                    {notification.type === 'warning' && 'Warning'}
                                                    {notification.type === 'reminder' && 'Pengingat'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Notifikasi akan otomatis dihapus setelah 30 hari</p>
                </div>
            </div>
        </div>
    );
};

export default Notifications;