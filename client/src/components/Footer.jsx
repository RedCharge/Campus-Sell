import React from 'react';

const Footer = () => {
  return (
    <footer className="hidden md:block bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold tracking-tight">LuxeMarket</h3>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              The ultimate destination for premium products. We deliver happiness to your doorstep with our fast and secure shipping.
            </p>
            <div className="flex gap-4 pt-2">
              {['Facebook', 'Twitter', 'Instagram'].map(social => (
                <div key={social} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">Help Center</div></li>
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">Transaction Services</div></li>
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">Contact Us</div></li>
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">Terms & Conditions</div></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">About Us</h4>
            <ul className="space-y-3 text-sm">
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">About LuxeMarket</div></li>
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">Careers</div></li>
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">Privacy Policy</div></li>
              <li><div className="hover:text-orange-500 transition-colors cursor-pointer">Blog</div></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Stay Up to Date</h4>
            <p className="text-sm mb-4 text-gray-400">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 border-none rounded-lg px-4 py-3 text-sm w-full focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-500"
              />
              <button className="bg-orange-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-900/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2024 LuxeMarket. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-orange-500">Privacy Policy</span>
            <span className="cursor-pointer hover:text-orange-500">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;