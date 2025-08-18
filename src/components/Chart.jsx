import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import NavbarAdmin from "../components/NavbarAdmin";

const MovieSalesDashboard = () => {
  const [salesMovie, setSalesMovie] = useState('Avengers: End Game');
  const [salesPeriod, setSalesPeriod] = useState('Weekly');
  const [ticketCategory, setTicketCategory] = useState('Adventure, Purwakarta');
  const [ticketLocation, setTicketLocation] = useState('Location');
  
  // Active filters that control what's displayed in charts
  const [activeSalesMovie, setActiveSalesMovie] = useState('Avengers: End Game');
  const [activeSalesPeriod, setActiveSalesPeriod] = useState('Weekly');
  const [activeTicketCategory, setActiveTicketCategory] = useState('Adventure, Purwakarta');
  const [activeTicketLocation, setActiveTicketLocation] = useState('Location');

  // Sample data for different movies and periods
  const salesDataSets = {
    'Avengers: End Game': {
      'Weekly': [
        { name: 'Week 1', value: 450 },
        { name: 'Week 2', value: 520 },
        { name: 'Week 3', value: 380 },
        { name: 'Week 4', value: 420 },
        { name: 'Week 5', value: 350 },
        { name: 'Week 6', value: 300 },
      ],
      'Monthly': [
        { name: 'Jan', value: 1200 },
        { name: 'Feb', value: 1450 },
        { name: 'Mar', value: 1100 },
        { name: 'Apr', value: 980 },
        { name: 'May', value: 1320 },
        { name: 'Jun', value: 1180 },
      ],
      'Yearly': [
        { name: '2019', value: 8500 },
        { name: '2020', value: 4200 },
        { name: '2021', value: 6800 },
        { name: '2022', value: 9200 },
        { name: '2023', value: 11500 },
        { name: '2024', value: 12800 },
      ],
    },
    'Spider-Man': {
      'Weekly': [
        { name: 'Week 1', value: 320 },
        { name: 'Week 2', value: 380 },
        { name: 'Week 3', value: 290 },
        { name: 'Week 4', value: 350 },
        { name: 'Week 5', value: 280 },
        { name: 'Week 6', value: 240 },
      ],
      'Monthly': [
        { name: 'Jan', value: 900 },
        { name: 'Feb', value: 1050 },
        { name: 'Mar', value: 800 },
        { name: 'Apr', value: 720 },
        { name: 'May', value: 950 },
        { name: 'Jun', value: 850 },
      ],
      'Yearly': [
        { name: '2019', value: 6200 },
        { name: '2020', value: 3100 },
        { name: '2021', value: 5400 },
        { name: '2022', value: 7800 },
        { name: '2023', value: 8900 },
        { name: '2024', value: 9500 },
      ],
    },
    'Black Panther': {
      'Weekly': [
        { name: 'Week 1', value: 520 },
        { name: 'Week 2', value: 480 },
        { name: 'Week 3', value: 430 },
        { name: 'Week 4', value: 390 },
        { name: 'Week 5', value: 320 },
        { name: 'Week 6', value: 280 },
      ],
      'Monthly': [
        { name: 'Jan', value: 1400 },
        { name: 'Feb', value: 1200 },
        { name: 'Mar', value: 1100 },
        { name: 'Apr', value: 950 },
        { name: 'May', value: 1150 },
        { name: 'Jun', value: 1050 },
      ],
      'Yearly': [
        { name: '2019', value: 7800 },
        { name: '2020', value: 3800 },
        { name: '2021', value: 6200 },
        { name: '2022', value: 8500 },
        { name: '2023', value: 10200 },
        { name: '2024', value: 11800 },
      ],
    },
    'Captain Marvel': {
      'Weekly': [
        { name: 'Week 1', value: 380 },
        { name: 'Week 2', value: 420 },
        { name: 'Week 3', value: 350 },
        { name: 'Week 4', value: 300 },
        { name: 'Week 5', value: 270 },
        { name: 'Week 6', value: 220 },
      ],
      'Monthly': [
        { name: 'Jan', value: 1000 },
        { name: 'Feb', value: 1150 },
        { name: 'Mar', value: 900 },
        { name: 'Apr', value: 800 },
        { name: 'May', value: 1000 },
        { name: 'Jun', value: 900 },
      ],
      'Yearly': [
        { name: '2019', value: 6500 },
        { name: '2020', value: 3200 },
        { name: '2021', value: 5800 },
        { name: '2022', value: 7200 },
        { name: '2023', value: 8500 },
        { name: '2024', value: 9200 },
      ],
    },
  };

  // Sample data for different ticket categories and locations
  const ticketDataSets = {
    'Adventure, Purwakarta': {
      'Jakarta': [
        { name: 'Jan', value: 180 },
        { name: 'Feb', value: 220 },
        { name: 'Mar', value: 350 },
        { name: 'Apr', value: 160 },
        { name: 'May', value: 200 },
        { name: 'Jun', value: 250 },
      ],
      'Bandung': [
        { name: 'Jan', value: 200 },
        { name: 'Feb', value: 250 },
        { name: 'Mar', value: 400 },
        { name: 'Apr', value: 180 },
        { name: 'May', value: 220 },
        { name: 'Jun', value: 280 },
      ],
      'Surabaya': [
        { name: 'Jan', value: 150 },
        { name: 'Feb', value: 190 },
        { name: 'Mar', value: 300 },
        { name: 'Apr', value: 140 },
        { name: 'May', value: 180 },
        { name: 'Jun', value: 230 },
      ],
      'Purwakarta': [
        { name: 'Jan', value: 120 },
        { name: 'Feb', value: 160 },
        { name: 'Mar', value: 250 },
        { name: 'Apr', value: 110 },
        { name: 'May', value: 150 },
        { name: 'Jun', value: 200 },
      ],
    },
    'Action, Jakarta': {
      'Jakarta': [
        { name: 'Jan', value: 320 },
        { name: 'Feb', value: 380 },
        { name: 'Mar', value: 420 },
        { name: 'Apr', value: 290 },
        { name: 'May', value: 350 },
        { name: 'Jun', value: 390 },
      ],
      'Bandung': [
        { name: 'Jan', value: 280 },
        { name: 'Feb', value: 330 },
        { name: 'Mar', value: 370 },
        { name: 'Apr', value: 250 },
        { name: 'May', value: 310 },
        { name: 'Jun', value: 340 },
      ],
      'Surabaya': [
        { name: 'Jan', value: 250 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 340 },
        { name: 'Apr', value: 220 },
        { name: 'May', value: 280 },
        { name: 'Jun', value: 310 },
      ],
      'Purwakarta': [
        { name: 'Jan', value: 180 },
        { name: 'Feb', value: 220 },
        { name: 'Mar', value: 260 },
        { name: 'Apr', value: 160 },
        { name: 'May', value: 200 },
        { name: 'Jun', value: 240 },
      ],
    },
    'Drama, Bandung': {
      'Jakarta': [
        { name: 'Jan', value: 220 },
        { name: 'Feb', value: 270 },
        { name: 'Mar', value: 310 },
        { name: 'Apr', value: 190 },
        { name: 'May', value: 240 },
        { name: 'Jun', value: 280 },
      ],
      'Bandung': [
        { name: 'Jan', value: 260 },
        { name: 'Feb', value: 320 },
        { name: 'Mar', value: 380 },
        { name: 'Apr', value: 230 },
        { name: 'May', value: 290 },
        { name: 'Jun', value: 340 },
      ],
      'Surabaya': [
        { name: 'Jan', value: 190 },
        { name: 'Feb', value: 240 },
        { name: 'Mar', value: 280 },
        { name: 'Apr', value: 170 },
        { name: 'May', value: 210 },
        { name: 'Jun', value: 250 },
      ],
      'Purwakarta': [
        { name: 'Jan', value: 140 },
        { name: 'Feb', value: 180 },
        { name: 'Mar', value: 210 },
        { name: 'Apr', value: 120 },
        { name: 'May', value: 160 },
        { name: 'Jun', value: 190 },
      ],
    },
    'Comedy, Surabaya': {
      'Jakarta': [
        { name: 'Jan', value: 280 },
        { name: 'Feb', value: 330 },
        { name: 'Mar', value: 380 },
        { name: 'Apr', value: 250 },
        { name: 'May', value: 300 },
        { name: 'Jun', value: 340 },
      ],
      'Bandung': [
        { name: 'Jan', value: 240 },
        { name: 'Feb', value: 290 },
        { name: 'Mar', value: 340 },
        { name: 'Apr', value: 210 },
        { name: 'May', value: 260 },
        { name: 'Jun', value: 300 },
      ],
      'Surabaya': [
        { name: 'Jan', value: 320 },
        { name: 'Feb', value: 380 },
        { name: 'Mar', value: 420 },
        { name: 'Apr', value: 290 },
        { name: 'May', value: 350 },
        { name: 'Jun', value: 390 },
      ],
      'Purwakarta': [
        { name: 'Jan', value: 160 },
        { name: 'Feb', value: 200 },
        { name: 'Mar', value: 240 },
        { name: 'Apr', value: 140 },
        { name: 'May', value: 180 },
        { name: 'Jun', value: 220 },
      ],
    },
  };

  // Get current data based on active filters (only change when Filter button is clicked)
  const getCurrentSalesData = () => {
    return salesDataSets[activeSalesMovie]?.[activeSalesPeriod] || salesDataSets['Avengers: End Game']['Weekly'];
  };

  const getCurrentTicketData = () => {
    const locationKey = activeTicketLocation === 'Location' ? 'Jakarta' : activeTicketLocation;
    return ticketDataSets[activeTicketCategory]?.[locationKey] || ticketDataSets['Adventure, Purwakarta']['Jakarta'];
  };

  const handleFilter = (type) => {
    if (type === 'sales') {
      setActiveSalesMovie(salesMovie);
      setActiveSalesPeriod(salesPeriod);
      console.log('Sales filter applied:', { salesMovie, salesPeriod });
    } else if (type === 'ticket') {
      setActiveTicketCategory(ticketCategory);
      setActiveTicketLocation(ticketLocation);
      console.log('Ticket filter applied:', { ticketCategory, ticketLocation });
    }
  };

  // Custom tooltip for better styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-blue-500">
          <p className="text-sm">{`${label}: $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomTicketTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-blue-500">
          <p className="text-sm">{`${label}: ${payload[0].value} tickets`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <NavbarAdmin/>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Sales Chart Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sales Chart</h2>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={salesMovie}
              onChange={(e) => setSalesMovie(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Avengers: End Game">Avengers: End Game</option>
              <option value="Spider-Man">Spider-Man</option>
              <option value="Black Panther">Black Panther</option>
              <option value="Captain Marvel">Captain Marvel</option>
            </select>

            <select
              value={salesPeriod}
              onChange={(e) => setSalesPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>

            <button
              onClick={() => handleFilter('sales')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Filter
            </button>
          </div>

          {/* Current Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">{activeSalesMovie} - {activeSalesPeriod}</p>
          </div>

          {/* Chart Container */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getCurrentSalesData()}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff', r: 6 }}
                  activeDot={{ r: 8, fill: '#3B82F6', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Sales Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Ticket Sales</h2>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={ticketCategory}
              onChange={(e) => setTicketCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Adventure, Purwakarta">Adventure, Purwakarta</option>
              <option value="Action, Jakarta">Action, Jakarta</option>
              <option value="Drama, Bandung">Drama, Bandung</option>
              <option value="Comedy, Surabaya">Comedy, Surabaya</option>
            </select>

            <select
              value={ticketLocation}
              onChange={(e) => setTicketLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Location">All Locations</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Purwakarta">Purwakarta</option>
            </select>

            <button
              onClick={() => handleFilter('ticket')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Filter
            </button>
          </div>

          {/* Current Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">{ticketCategory} - {ticketLocation === 'Location' ? 'All Locations' : ticketLocation}</p>
          </div>

          {/* Chart Container */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getCurrentTicketData()}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="ticketGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTicketTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#ticketGradient)"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff', r: 6 }}
                  activeDot={{ r: 8, fill: '#3B82F6', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieSalesDashboard;