import { useState } from 'react';
import { Search, MoreHorizontal, ChevronDown, Star } from 'lucide-react';
import NavbarDashboard from '../components/NavbarDashboard';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('Order History');
  const [showModal, setShowModal] = useState(false);
  const [showAvengersModal, setShowAvengersModal] = useState(false);
  const [showAvengersModal2, setShowAvengersModal2] = useState(false);
 

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
     <NavbarDashboard/>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* Info Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">INFO</span>
                <button className="text-purple-600 hover:text-purple-700">
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
          <main className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex mb-8 bg-white rounded-2xl p-6 items-center">
              <a href="/profile">
              <button className='text-gray-400 cursor-pointer hover:text-blue-600'> 
                Account Settings
              </button>  
              </a>
              <button
                onClick={() => setActiveTab('Order History')}
                className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'Order History'
                    ? 'border-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Order History
              </button>
            </div>

            {activeTab === 'Order History' && (
              <div className="space-y-6">
                {/* Movie Entry 1 - Spider-Man */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-2">Tuesday, 07 July 2020 - 04:30pm</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Spider-Man: Homecoming</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="inline-flex items-center px-2 py-1 lg:px-4 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          Ticket in active
                        </span>
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                          Not Paid
                        </span>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end">
                      <div className="text-right mb-4">
                       <img src="/CineOne21 2.svg" alt="" />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowModal(!showModal)}
                    className="cursor-pointer flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Show Details
                    <ChevronDown className={`cursor-pointer w-4 h-4 ml-2 transform transition-transform ${showModal ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Expanded Details for Spider-Man */}
                  {showModal && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-6">Ticket Information</h4>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className='flex items-center gap-112'>
                            <p className="text-sm text-gray-500 mb-1">No. Rekening Virtual :</p>
                            <p className="font-mono text-lg font-bold text-gray-900">12321328913829724</p>
                          </div>
                          <button 
                            onClick={() => copyToClipboard('12321328913829724')}
                            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50"
                          >
                            Copy
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Total Payment :</p>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">$30</div>
                        </div>
                        
                        <div className="text-sm text-gray-600 leading-relaxed">
                          Pay this payment bill before it is due, on <span className="font-semibold text-red-600">June 23, 2023</span>. If the bill has not been paid by the specified time, it will be forfeited
                        </div>
                        
                        <button className=" bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                          Cek Pembayaran
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Movie Entry 2 - Avengers */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-2">Monday, 14 June 2020 - 02:00pm</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Avengers: End Game</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          Ticket used
                        </span>
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end">
                      <div className="text-right mb-4">
                        <img src="/ebv.id 2.svg" alt="" />
                      </div>
                    </div>
                  </div>

                  
                  <button 
                    onClick={() => setShowAvengersModal(!showAvengersModal)}
                    className="cursor-pointer flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Show Details
                    <ChevronDown className={`cursor-pointer w-4 h-4 ml-2 transform transition-transform ${showAvengersModal ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded Details for Avengers */}
                  {showAvengersModal && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-6">Ticket Information</h4>
                      
                      <div className="flex gap-6 items-center">
                        {/* QR Code */}
                        <img src="/QR Code 1.svg" alt="" />

                        {/* Ticket Details */}
                        <div className="flex-1">
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Category</p>
                              <p className="text-sm font-medium text-gray-900">PG-13</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Time</p>
                              <p className="text-sm font-medium text-gray-900">2:00pm</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Seats</p>
                              <p className="text-sm font-medium text-gray-900">C4, C5, C6</p>
                            </div>
                          </div>
                          

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Movie</p>
                              <p className="text-sm font-medium text-gray-900">Spider-Man: ...</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Date</p>
                              <p className="text-sm font-medium text-gray-900">07 Jul</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Count</p>
                              <p className="text-sm font-medium text-gray-900">3 pcs</p>
                            </div>
                          </div>

                          {/* Total */}
                          {/* <div className="pt-3  border-gray-200">
                            <span className="text-sm font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">$30.00</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                {/*clone  */}

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-2">Monday, 14 June 2020 - 02:00pm</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Avengers: End Game</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          Ticket used
                        </span>
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end">
                      <div className="text-right mb-4">
                        <img src="/ebv.id 2.svg" alt="" />
                      </div>
                    </div>
                  </div>

                  
                  <button 
                    onClick={() => setShowAvengersModal2(!showAvengersModal2)}
                    className="cursor-pointer flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Show Details
                    <ChevronDown className={`cursor-pointer w-4 h-4 ml-2 transform transition-transform ${showAvengersModal2 ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded Details for Avengers */}
                  {showAvengersModal2 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-6">Ticket Information</h4>
                      
                      <div className="flex gap-6 items-center">
                        {/* QR Code */}
                        <img src="/QR Code 1.svg" alt="" />

                        {/* Ticket Details */}
                        <div className="flex-1">
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Category</p>
                              <p className="text-sm font-medium text-gray-900">PG-13</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Time</p>
                              <p className="text-sm font-medium text-gray-900">2:00pm</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Seats</p>
                              <p className="text-sm font-medium text-gray-900">C4, C5, C6</p>
                            </div>
                          </div>
                          

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Movie</p>
                              <p className="text-sm font-medium text-gray-900">Spider-Man: ...</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Date</p>
                              <p className="text-sm font-medium text-gray-900">07 Jul</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Count</p>
                              <p className="text-sm font-medium text-gray-900">3 pcs</p>
                            </div>
                          </div>

                          {/* Total */}
                          {/* <div className="pt-3  border-gray-200">
                            <span className="text-sm font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">$30.00</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;