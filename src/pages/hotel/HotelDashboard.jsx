import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Hotel as HotelIcon, 
  Bed, 
  Users, 
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BASE_API_URL } from '../../services/api';

export default function HotelDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    room_number: '',
    room_type: '',
    check_in: '',
    check_out: '',
    guests_count: 1,
    rate_per_night: 0
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/room-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const checkIn = new Date(bookingForm.check_in);
      const checkOut = new Date(bookingForm.check_out);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalAmount = nights * bookingForm.rate_per_night;

      const res = await fetch(`${BASE_API_URL}/room-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          guest_name: bookingForm.guest_name,
          guest_phone: bookingForm.guest_phone,
          guest_email: bookingForm.guest_email,
          room_number: bookingForm.room_number,
          room_type: bookingForm.room_type,
          check_in: bookingForm.check_in,
          check_out: bookingForm.check_out,
          guests_count: bookingForm.guests_count,
          rate_per_night: bookingForm.rate_per_night,
          total_amount: totalAmount,
          status: 'confirmed',
          booked_by: user.id
        })
      });

      if (res.ok) {
        setShowBookingModal(false);
        setBookingForm({
          guest_name: '',
          guest_phone: '',
          guest_email: '',
          room_number: '',
          room_type: '',
          check_in: '',
          check_out: '',
          guests_count: 1,
          rate_per_night: 0
        });
        loadBookings();
        alert('Booking created successfully');
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking');
    }
  };

  const handleCheckIn = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/room-bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'checked_in' })
      });

      if (res.ok) {
        loadBookings();
      }
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_API_URL}/room-bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'checked_out' })
      });

      if (res.ok) {
        loadBookings();
        alert('Guest checked out successfully');
      }
    } catch (error) {
      console.error('Failed to check out:', error);
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in');
  const checkedInToday = bookings.filter(b => {
    if (b.status !== 'checked_in') return false;
    const checkinDate = new Date(b.check_in).toDateString();
    const today = new Date().toDateString();
    return checkinDate === today;
  });
  const occupiedRooms = bookings.filter(b => b.status === 'checked_in').length;
  const todayRevenue = bookings
    .filter(b => {
      const checkinDate = new Date(b.check_in).toDateString();
      const today = new Date().toDateString();
      return checkinDate === today && b.status !== 'cancelled';
    })
    .reduce((sum, b) => sum + b.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotel Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Occupied Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{occupiedRooms}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Bed className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{activeBookings.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">KES {todayRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Check-ins Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{checkedInToday.length}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bookings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Current Bookings</h2>

        {activeBookings.length === 0 ? (
          <div className="text-center py-8">
            <HotelIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((booking) => {
              const checkIn = new Date(booking.check_in);
              const checkOut = new Date(booking.check_out);
              const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={booking.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 rounded-full p-2">
                          <HotelIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.guest_name}</p>
                          <p className="text-sm text-gray-600">Room {booking.room_number} • {booking.room_type}</p>
                        </div>
                      </div>

                      <div className="ml-11 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Check-in</p>
                          <p className="text-sm text-gray-900">{checkIn.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Check-out</p>
                          <p className="text-sm text-gray-900">{checkOut.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Duration</p>
                          <p className="text-sm text-gray-900">{nights} night{nights > 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Guests</p>
                          <p className="text-sm text-gray-900">{booking.guests_count}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Rate/Night</p>
                          <p className="text-sm text-gray-900">KES {booking.rate_per_night?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Total</p>
                          <p className="text-sm font-bold text-blue-600">KES {booking.total_amount?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'checked_in'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-700'
                            : booking.status === 'checked_out'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCheckIn(booking.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Check In
                        </button>
                      )}

                      {booking.status === 'checked_in' && (
                        <button
                          onClick={() => handleCheckOut(booking.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Check Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">New Booking</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={bookingForm.guest_name}
                  onChange={(e) => setBookingForm({ ...bookingForm, guest_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter guest name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.guest_phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, guest_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={bookingForm.guest_email}
                    onChange={(e) => setBookingForm({ ...bookingForm, guest_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="guest@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={bookingForm.room_number}
                    onChange={(e) => setBookingForm({ ...bookingForm, room_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    value={bookingForm.room_type}
                    onChange={(e) => setBookingForm({ ...bookingForm, room_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select room type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.check_in}
                    onChange={(e) => setBookingForm({ ...bookingForm, check_in: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.check_out}
                    onChange={(e) => setBookingForm({ ...bookingForm, check_out: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    value={bookingForm.guests_count}
                    onChange={(e) => setBookingForm({ ...bookingForm, guests_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate per Night (KES)
                  </label>
                  <input
                    type="number"
                    value={bookingForm.rate_per_night}
                    onChange={(e) => setBookingForm({ ...bookingForm, rate_per_night: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
