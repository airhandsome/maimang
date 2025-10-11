import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-10 bg-cream text-leaf py-12 px-4 border-t border-gold/30">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center mr-3 shadow-sm">
                <span className="font-bold text-white">芒</span>
              </div>
              <div className="text-2xl font-display">
                <span className="text-gold">麦</span>
                <span className="text-leaf">芒</span>
                <span className="text-mint">文学社</span>
              </div>
            </div>
            <p className="text-leaf/80">
              青春如穗，文字如芒。我们在文字的田野里，播种、生长、收获。
            </p>
          </div>

          <div>
            <h4 className="text-xl mb-4 text-gold">联系我们</h4>
            <ul className="space-y-3 text-leaf/90">
              <li>邮箱：wheat@maimang.org</li>
              <li>地址：青春路88号麦田书屋</li>
              <li>电话：138-xxxx-8877</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl mb-4 text-gold">关注我们</h4>
            <p className="text-leaf/80 mb-4">在社交媒体上，感受文字的生长力量</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-mint transition-colors">微</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-mint transition-colors">博</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-mint transition-colors">图</a>
            </div>
            <div className="mt-6">
              <h5 className="text-leaf/80 mb-2">订阅我们的电子麦报</h5>
              <form className="flex">
                <input type="email" placeholder="你的邮箱" className="px-4 py-2 rounded-l-lg focus:outline-none text-leaf flex-1 bg-white border border-gold/40" />
                <button type="submit" className="bg-gold text-white px-4 py-2 rounded-r-lg hover:bg-mint transition-colors">订阅</button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/30 pt-6 text-center text-leaf/70 text-sm">
          <p>© {new Date().getFullYear()} 麦芒文学社 · 青春如穗，文字如芒</p>
        </div>
      </div>
    </footer>
  );
}
