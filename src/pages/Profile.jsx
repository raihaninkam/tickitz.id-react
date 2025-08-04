import { useState } from 'react';
import { Link } from 'react-router';
import { Search, MoreHorizontal, ChevronDown, Star,  } from 'lucide-react';
import NavbarDashboard from '../components/NavbarDashboard'


const ProfilePage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Raihan',
    lastName: 'Insan Kamil',
    email: 'raihankamil37@gmail.com',
    phoneNumber: '+62  |  8111727072',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-opacity-50 font-sans">
      {/* Header Navigation */}
     <NavbarDashboard />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Profile Sidebar */}
           <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* Info Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">INFO</span>
                <button className="text-blue-600 hover:text-blue-700">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              {/* User Profile */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Jonas El Rodriguez</h3>
                <p className="text-sm text-gray-500">Moviegoers</p>
              </div>
              
              {/* Loyalty Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Loyalty Points</h4>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white mb-4 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <span className="text-sm opacity-90">Moviegoers</span>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-600 fill-current" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold relative z-10">
                    320<span className="text-sm font-normal opacity-75 ml-1">points</span>
                  </div>                
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">180 points become a master</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>  

          {/* Content Area */}
          <main className="min-h-96">
            {/* Tabs */}
            <div className="flex border-b-2 border-slate-200 mb-8 bg-white rounded-xl p-6 shadow-sm">
              <a
                href="#"
                className="py-3 pr-10 text-slate-800 text-sm font-medium relative"
              >
                Account Settings
                <div className="text-blue-600 absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
              </a>
              <Link
                to="/order-history"
                className="py-3 pr-10 text-slate-400 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                Order History
              </Link>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
              <h2 className="text-base font-semibold text-slate-800 mb-6">
                Details Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <label className="text-sm text-slate-500 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-slate-500 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-slate-500 mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-slate-500 mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
              <h2 className="text-base font-semibold text-slate-800 mb-6">
                Account and Privacy
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm text-slate-500 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      className="px-4 py-3 pr-12 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white w-full placeholder-slate-400"
                      placeholder="Write your password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 text-base hover:text-slate-500"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showNewPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-slate-500 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="px-4 py-3 pr-12 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white w-full placeholder-slate-400"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 text-base hover:text-slate-500"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showConfirmPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-700 text-white px-12 py-3.5 rounded-lg text-sm font-semibold transition-all hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              Update changes
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;