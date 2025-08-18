import { Search, MoreHorizontal, ChevronDown, Star,  } from 'lucide-react';
const ProfileSidebar = () => {
    return (
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
    )
};

export default ProfileSidebar;